class CreateS3BucketRedirect {
  constructor(serverless, options) {
    console.log('OPTIONS:', JSON.stringify(options))
    this.hooks = {
      // this is where we declare the hook we want our code to run
      'after:deploy:finalize': () => { this.run(serverless) },
    }
  }
  run(serverless) {
    const lambdaFunctionName = 'resizer'
    const resources = serverless.service.provider.compiledCloudFormationTemplate.Resources
    const stage = serverless.service.provider.stage
    // Let's check if we already specified WebsiteConfiguration for our S3 bucket.
    // If it's already specified we don't need to do any work.

    if (!resources.SourceImageBucket) {
      console.error('We have not defined source bucket and nothing will work without it!')
    }
    if (resources.SourceImageBucket &&
      resources.SourceImageBucket.Properties.WebsiteConfiguration) {
      console.log('WE DONT NEED TO DO ANY WORK!!!')

      return
    }
    let apiGatewayEndpoint = null

    serverless.pluginManager.plugins.forEach((plugin) => {
      if (plugin.constructor.name === 'AwsInfo') {
        apiGatewayEndpoint = plugin.gatheredData.info.endpoint
      }
    })
    if (!apiGatewayEndpoint) {
      console.error(`
        Could not find the apiGatewayEndpoint under serverless.pluginManager.plugins[filter=class[AwsInfo]].gatheredData.info.endpoint,
        it might be due-to breaking changes in the Serverless.
      `)
    }
    apiGatewayEndpoint = apiGatewayEndpoint
      .substring('https://'.length, apiGatewayEndpoint.length - (stage.length + 1))
    console.log('API_GATEWAY', apiGatewayEndpoint)

    const s3 = new serverless.providers.aws.sdk.S3()

    const params = {
      Bucket: process.env.SOURCE_S3_BUCKET_NAME,
      WebsiteConfiguration: {
        ErrorDocument: {
          Key: 'error.html',
        },
        IndexDocument: {
          Suffix: 'index.html',
        },
        RoutingRules: [
          {
            Redirect: {
              HttpRedirectCode: '302',
              HostName: apiGatewayEndpoint,
              ReplaceKeyPrefixWith: [stage, lambdaFunctionName, ''].join('/'),
              Protocol: 'https',
            },
            Condition: {
              HttpErrorCodeReturnedEquals: '404',
            },
          },
        ],
      },
    }

    console.log(JSON.stringify(params))
    s3.putBucketWebsite(params, (err, data) => {
      if (err) {
        console.log(err, err.stack) // an error occurred
      } else {
        console.log(data) // successful response
      }
    })
  }
}

// now we need to make our plugin object available to the framework to execute
module.exports = CreateS3BucketRedirect
