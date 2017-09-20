import { S3 } from 'aws-sdk';
import s3PublicUrl from 's3-public-url';

const s3 = new S3();
// @todo: write more docs
// downloads image from the bucket

export const downloadImage = (bucket, guid, format) => {
	const filename = [guid, '.', format].join('');
	const params = {
		Bucket: bucket,
		Key: filename,
	};

	return new Promise((resolve, reject) => {
		s3.getObject(params, (err, data) => {
			if (err) {
				console.error(err.code, '-', err.message);

				return reject(err);
			}

			return resolve(data.Body);

        // fs.writeFile(['', 'tmp', filename].join('/'), data.Body, (err) => {
        //   if(err)
        //     console.log(err.code, "-", err.message);
        //   return reject(err);
        // });
		});
	});
};

// @todo: write more docs
// upload image to bucket

export const uploadImage = (bucket, imageBuffer, guid, format, paramsString = '') => {
	const filename = [guid, ',', paramsString, '.', format].join('');
	const params = {
		Bucket: bucket,
		Key: filename,
		Body: imageBuffer,
		ACL: 'public-read',
		ContentType: ['image', format].join('/'),
	};

	return new Promise((resolve, reject) => {
		s3.putObject(params, (err, data) => {
			if (err) {
				console.error(err.code, '-', err.message);

				return reject(err);
			}
      // @todo: add support for different region: https://www.npmjs.com/package/s3-public-url
			const url = s3PublicUrl.getHttps(bucket, filename);

			return resolve({
				url,
				...data,
			});
		});
	});
};
