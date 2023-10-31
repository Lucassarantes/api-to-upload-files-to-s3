# API Documentation

This document provides an overview of how the provided API works and instructions on how to use it. The API is designed to interact with a MySQL database and Amazon S3 for handling images.

## Table of Contents
- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
  - [API Endpoints](#api-endpoints)
    - [Get Images](#get-images)
      - [Endpoint: `GET /getImages`](#endpoint-get-getimages)
    - [Insert Image](#insert-image)
      - [Endpoint: `POST /insertImage`](#endpoint-post-insertimage)
    - [Additional Function](#additional-function)
      - [`addImage2S3`](#addimage2s3)
  - [Serverless.yml Configuration](#serverlessyml-configuration)

---

## Prerequisites

Before using the API, you should have the following prerequisites in place:

- Node.js installed on your system (Node.js 18.x is recommended).
- AWS SDK and AWS credentials configured if you plan to use Amazon S3.
- A MySQL database set up with the necessary credentials and table structure.

## Configuration

To configure the API, you need to set up environment variables. The following environment variables should be defined:

- `MYSQL_HOST`: The hostname of your MySQL database.
- `MYSQL_USER`: The MySQL username for database access.
- `MYSQL_PASSWORD`: The password for the MySQL user.
- `MYSQL_DATABASE`: The name of the MySQL database.
- `BUCKET_NAME`: The name of the Amazon S3 bucket where you want to store images.

Make sure to configure these environment variables before using the API.

## API Endpoints

The API provides two main endpoints for interacting with images: `getImages` and `insertImage`.

### Get Images

#### Endpoint: `GET /getImages`

This endpoint retrieves all images stored in the MySQL database.

**Request:**
- Method: `GET`

**Response:**
- Status Code: `200` if successful.
- Status Code: `500` if there is an internal server error.
- Response Body: JSON array containing image data.

**Usage:**
To retrieve all images, send a `GET` request to the `/getImages` endpoint.

### Insert Image

#### Endpoint: `POST /insertImage`

This endpoint allows you to upload images to Amazon S3 and insert image data into the MySQL database.

**Request:**
- Method: `POST`
- Request Body: JSON object with the following fields:
  - `filename`: The name of the image.
  - `description`: A description of the image.
  - `imageBase64`: The image data in base64 format.
  - `contentType`: The content type of the image.

**Response:**
- Status Code: `200` if successful.
- Status Code: `500` if there is an internal server error.
- Response Body: JSON object with image data.

**Usage:**
To upload and insert an image, send a `POST` request to the `/insertImage` endpoint with the required JSON fields.

Example Request Body:
```json
{
  "filename": "my_image.jpg",
  "description": "A beautiful landscape",
  "imageBase64": "base64-encoded-image-data",
  "contentType": "image/jpeg"
}
```

### Additional Function

#### `addImage2S3`

The `addImage2S3` function is a serverless function that receives base64 image data, uploads it to Amazon S3, and returns the image's S3 URL. This function is used internally by the `insertImage` endpoint to handle the process of uploading images to Amazon S3.

**Usage:**
You can use this function programmatically to upload images to Amazon S3 and get the S3 URL. It abstracts the process of uploading images to Amazon S3 and allows the API to efficiently store image data.

## Serverless.yml Configuration

The serverless.yml file is used to define the configuration of your serverless application. Here are some explanations of specific sections in this file:

- `provider`: Defines the AWS provider settings, including the runtime, region, IAM role statements, and environment variables.
- `vpc`: Stands for Virtual Private Cloud. It allows you to isolate your resources in a private network. The `securityGroupIds` and `subnetIds` settings define the security groups and subnets associated with your Lambda functions. Security groups control inbound and outbound traffic to your functions, and subnets define the network segments where your functions run.

Be sure to customize the configuration according to your specific requirements, including Node.js version, AWS region, IAM roles, VPC settings, and other settings.
