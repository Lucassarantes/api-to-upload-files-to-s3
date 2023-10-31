const mysql = require('mysql2');
const util = require('util');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Create a MySQL connection pool (helps with performance)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
const bucket = process.env.BUCKET_NAME;
// Node native promisify, to use async/await with the MySQL library
const query = util.promisify(pool.query).bind(pool);

module.exports.getImages = async () => {
  try {
    // Query to get all images stored on database
    const results = await query('SELECT * FROM images');
    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error during database query execution:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

// Create function to upload images to S3 and insert image data on database
module.exports.insertImage = async (event) => {
  try {
    // Preventing null/empty event
    if (!event) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Missing any of these: filename; description; imageBase64; contentType;' })
      }
    }
    // Destructing the event object to get image data
    const { filename, description, imageBase64, contentType } = event;

    // Params which will be sent to S3 upload method 
    const paramsToS3 = {
      filename: filename,
      data: imageBase64,
      contentType: contentType
    };

    // Return of the function which upload the image to S3
    const url = await this.addImage2S3(paramsToS3);
    if (!url || url === '') return { statusCode: 500, body: JSON.stringify({ error: 'Error uploading image to s3' }) };

    // If the image was uploaded the image data will be stored on database by this query
    const results = await query('INSERT INTO images (image_name, image_description, image_url) VALUES (?, ?, ?)', [filename, description, url]);

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error }),
    };
  }
};

// create function addImage2S3 that receives the base64 image, uploads to s3 and return the image s3 url
module.exports.addImage2S3 = async (image) => {
  try {
    const { filename, contentType, data } = image;

    // Buffering the base64 image to send it to S3
    const buffer = Buffer.from(data, 'base64');

    // Storing the json object returned from a sucessful upload to return the image url
    const result = await s3.upload({
        Bucket: bucket,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read'
    }).promise();
    // Url provided from S3 when image was sucessfully uploaded
    return result.Location;

  } catch (error) {
    return error;
  }
}
