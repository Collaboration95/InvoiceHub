const AWS = require('aws-sdk');
const { AnalyzeExpenseCommand,TextractClient } = require("@aws-sdk/client-textract");
const { Rekognition } = require('@aws-sdk/client-rekognition');
const multer = require('multer');
const upload = multer().single('jpeg');
const express = require('express');
const router = express.Router();
const{pool,table_name}=require ('../server');

const accessKeyId = process.env.AWS_accessKeyId;
const secretAccessKey = process.env.AWS_secretAccessKey;
const region = process.env.AWS_region;

// router.post('/upload-jpeg123', (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       console.error('Error:', err);
//       return res.sendStatus(500);
//     }
//     const jpegData = req.file.buffer;
//     console.log("JpegData:", jpegData);
    
//     try {
//       const params = {
//         Image: {
//           Bytes: jpegData
//         }
//       };
//       const response = await rekognitionClient.detectText(params);
//       const textDetections = response.TextDetections.filter(detection => detection.Type != 'D');
//       textDetections.forEach(detection => {
//         const { Confidence, Geometry } = detection;
//         const { BoundingBox, Polygon } = Geometry;

//         console.log('Confidence:', Confidence);
//         console.log('Bounding Box:', BoundingBox);
//         console.log('Polygon:', Polygon);
//       });  

//       res.status(200).json(textDetections);
//     } catch (err) {
//       console.error('Error:', err);
//       res.status(500);
//     }
//   });
// });

// Create an S3 client

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region
});
const textractClient = new TextractClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

router.post('/upload-jpeg-bucket-new', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error:', err);
      return res.sendStatus(500);
    }

    const jpegData = req.file.buffer;
    console.log("JpegData:", jpegData);

    try {
      const s3_Upload_Params = {
        Bucket: 'imagebucket1234', // Replace with your bucket name
        Key: 'image.jpg', // Specify the desired key for the uploaded image
        Body: jpegData
      };

      const s3_reference = {
        Document: {
          S3Object: {
            Bucket: 'imagebucket1234', // Replace with your bucket name
            Name: 'image.jpg' // Specify the key of the uploaded image
          }
        }
      };

      const uploadResult = await s3.upload(s3_Upload_Params).promise();
      console.log('Image uploaded to S3:', uploadResult.Location);

      const aExpense = new AnalyzeExpenseCommand(s3_reference);
      const response = await textractClient.send(aExpense);

      const formattedData = response.ExpenseDocuments[0].SummaryFields.map(obj=>{
        return {
          type:obj.Type.Text,
          value:obj.ValueDetection.Text
        }
      });
      const tableData = response.ExpenseDocuments[0].LineItemGroups[0].LineItems[0].LineItemExpenseFields;
      const filteredElements = tableData.filter(elem => elem.Type.Text === "EXPENSE_ROW").map(elem => elem.ValueDetection.Text);

    const payload={
      invoice_data:formattedData,
      table_data:filteredElements
    }

      res.status(200).json(payload);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'An error occurred during text analysis.' });
    }
  });
});


// router.post('/upload-jpeg-bucket-new', (req, res) => {
//   // Code to try analyze the tables
//   upload(req, res, async (err) => {
//     if (err) {
//       console.error('Error:', err);
//       return res.sendStatus(500);
//     }

//     const jpegData = req.file.buffer;
//     console.log("JpegData:", jpegData);

//     try {
//       const s3_Upload_Params = {
//         Bucket: 'imagebucket1234', // Replace with your bucket name
//         Key: 'image.jpg', // Specify the desired key for the uploaded image
//         Body: jpegData
//       };

//       const s3_reference = {
//         Document: {
//           S3Object: {
//             Bucket: 'imagebucket1234', // Replace with your bucket name
//             Name: 'image.jpg' // Specify the key of the uploaded image
//           }
//         }
//       };

//       const uploadResult = await s3.upload(s3_Upload_Params).promise();
//       console.log('Image uploaded to S3:', uploadResult.Location);

//       const aExpense = new AnalyzeExpenseCommand(s3_reference);
//       const response = await textractClient.send(aExpense);
//       const formattedData = response.ExpenseDocuments[0].SummaryFields.map(obj=>{
//         return {
//           type:obj.Type.Text,
//           value:obj.ValueDetection.Text
//         }
//       });

//       res.status(200).json(formattedData);
//     } catch (err) {
//       console.error('Error:', err);
//       res.status(500).json({ error: 'An error occurred during text analysis.' });
//     }
//   });
// });



module.exports = router;
