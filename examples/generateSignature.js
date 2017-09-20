const crypto = require('crypto');
const guid = require('guid');

export default function (event, context, callback) {
	const body = JSON.parse(event.body);
	if (!body.file) {
		return callback(new Error('missing file'));
	}
	const file = body.file;
	const aws = {
		bucket: process.env.AWS_CDN_BUCKET,
		region: process.env.AWS_CDN_REGION,
		secret: process.env.AWS_CDN_SECRET,
		key: process.env.AWS_CDN_KEY,
	};
    // let s3Url = 'https://' + aws.bucket + '.s3-' + aws.region + '.amazonaws.com';
	const s3Url = process.env.AWS_CDN_URL;
	const fileName = guid.raw();
	const path = `${fileName}`;
	const readType = 'public-read';
	const expiration = Date.now() + (60 * 1000); // 1 minute
	const s3Policy = {
		expiration,
		conditions: [{
			bucket: aws.bucket,
		},
            ['starts-with', '$key', path],
		{
			acl: readType,
		},
		{
			success_action_status: '201',
		},
            ['content-length-range', 2048, 10485760], // min and max
            { 'content-type': file.type },
            { 'x-amz-meta-mime': file.type },
            { 'x-amz-meta-modified': String(file.lastModified) },
            { 'x-amz-meta-modified-date': String(file.lastModifiedDate) },
            { 'x-amz-meta-filename': file.name },
		],
	};
	const stringPolicy = JSON.stringify(s3Policy);
	const base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');
    // sign policy
	const signature = crypto.createHmac('sha1', aws.secret)
        .update(new Buffer(base64Policy, 'utf-8')).digest('base64');
	const credentials = {
		url: s3Url,
		fields: {
			key: path,
			AWSAccessKeyId: aws.key,
			acl: readType,
			policy: base64Policy,
			signature,
			'Content-Type': file.type,
			success_action_status: 201,
			'x-amz-meta-mime': file.type,
			'x-amz-meta-modified': String(file.lastModified),
			'x-amz-meta-modified-date': String(file.lastModifiedDate),
			'x-amz-meta-filename': file.name,
		},
		fileName,
	};

	return callback(null, {
		statusCode: 200,
		body: credentials,
	});
}
