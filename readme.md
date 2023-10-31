## Documentation
<Br>
The purpose of this API is to allow you to upload files to the AWS S3 bucket using serverless, it will upload the file and after that it will store the data of the file in a MySQL database, there is an endpoint to get images which were stored on database.

Contents: (title)

- [Environment and Configurations](#environment-and-configurations);
- [Endpoints](#endpoints);
- [Usage](#usage);
- [Addtional Functions](#addtional-functions);
- [Addtional Informations](#addtional-informations);

### Environment and Configurations:

-&#8211; Node version: 18.x;

You need to configure to run the API with your credentials: <br>
-&#8211; AWS;<br> 
-&#8211; AWS SDK;<br>
-&#8211; S3;<Br>
-&#8211; MySQL;<br>

### Endpoints

**Path:** /getImages <br>
**Goal:** This endpoint is responsible for bring the data inside the database of all the images that are avalibe in the database.

**Path:** /insertImage <br>
**Goal:** This endpoint is responsible for upload one file to AWS S3 and after that store the image data on the database.

### Usage

#### /getImages

Method: `GET`<br>
Params: This endpoint doesn't need any parameters.<br>
Return: a json object with status code 200 and all images data inside the database or in case of an error a 500 status code with the error message.

#### /insertImage

Method: `POST`<br>
Params: 
```json
{
    "filename":"your_image.jpg",
    "description":"image description",
    "contentType":"image/jpeg'",
    "imageBase64":"base64EncodedImage"
}
```
Addtional information: the contentType is the type of file which will be uploaded.
<br>
Return: json object with status code 200 and the json object returned by upload function from S3 or in case of an error a 500 status code with the error message.
<br>

### Addtional Functions

#### addImage2S3

It's not an endpoint available to be called, it's the function which is responsible for upload the image to S3 and is called by the insertImage function.


### Adtional Informations

This function is configurated to run in subnets which are located in a specific VPC if you will use a VPC you'll need to change the subnets with yours and if don't need to run this in a VPC you can only remove it on serverless.yml.