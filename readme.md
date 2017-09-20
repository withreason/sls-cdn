
## 1. Setup Your Bucket

Once your bucket has been created, you will need to deploy the lambda make sure these are both accessible by the same IAM user as per setup in your AWS profile on your current machine. 

## 2. Lambda and s3 CDN

Get this

```
serverless install -u [this]  --name [YOUR NAME HERE]
```

## 3. Deploy this

```
npm run deploy
```

### 4. CORS rules

Add CORS rules to your bucket

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>Authorization</AllowedHeader>
</CORSRule>
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
``` 

## 5. Static website hosting

If your redirection rules are not added automatically, please setup your bucket to have static website hosting enabled, by default you will need to add index and error documents, even though these aren't used.

|key    |value  |
|---	|---	|
|Use this bucket to host a website |`yes`|
|Index document |`index.html`|
|Error document |`error.html`|

Add the following redirection rule to your bucket, replacing `YOUR_LAMBDA_URL.execute-api.YOUR_LAMBDA_REGION.amazonaws.com` with your lambda url. 

```xml
<RoutingRules>
  <RoutingRule>
    <Condition>
      <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
    </Condition>
    <Redirect>
      <Protocol>https</Protocol>
      <HostName>YOUR_LAMBDA_URL.execute-api.YOUR_LAMBDA_REGION.amazonaws.com</HostName>
      <ReplaceKeyPrefixWith>dev/resizer/</ReplaceKeyPrefixWith>
      <HttpRedirectCode>302</HttpRedirectCode>
    </Redirect>
  </RoutingRule>
</RoutingRules>
```

## 6. Signed upload

> TODO : Document this