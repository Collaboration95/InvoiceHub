const request = require('supertest');
const express = require('express');
const app = express();
const router = express.Router();
const awsRouter = require('./routes/rekognition');
app.use('/rekognition/',awsRouter);

describe('POST /upload-jpeg', () => {
  it('should respond with 200 and text detections', async () => {
    // Mock AWS Rekognition detectText function
    const rekognitionClient = require('@aws-sdk/client-rekognition');
    rekognitionClient.Rekognition = jest.fn().mockReturnValue({
      detectText: jest.fn().mockResolvedValue({
        TextDetections: [
          { Confidence: 0.9, Geometry: { BoundingBox: {}, Polygon: {} } },
          { Confidence: 0.8, Geometry: { BoundingBox: {}, Polygon: {} } },
        ],
      }),
    });

    const jpegData = Buffer.from('dummyImageData', 'utf-8');

    const response = await request(app)
      .post('/upload-jpeg')
      .attach('jpeg', jpegData, 'test.jpg');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { Confidence: 0.9, Geometry: { BoundingBox: {}, Polygon: {} } },
      { Confidence: 0.8, Geometry: { BoundingBox: {}, Polygon: {} } },
    ]);
  });

  it('should respond with 500 on error', async () => {
    // Mock AWS Rekognition detectText function to throw an error
    const rekognitionClient = require('@aws-sdk/client-rekognition');
    rekognitionClient.Rekognition = jest.fn().mockReturnValue({
      detectText: jest.fn().mockRejectedValue(new Error('AWS Error')),
    });

    const jpegData = Buffer.from('dummyImageData', 'utf-8');

    const response = await request(app)
      .post('/upload-jpeg')
      .attach('jpeg', jpegData, 'test.jpg');

    expect(response.status).toBe(500);
  });
});

describe('POST /upload-jpeg-bucket', () => {
  it('should respond with 200 and text detections', async () => {
    // Mock AWS S3 upload function
    const AWS = require('aws-sdk');
    AWS.S3.prototype.upload = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Location: 'uploaded_image_url' }),
    });

    // Mock AWS Rekognition detectText function
    const rekognitionClient = require('@aws-sdk/client-rekognition');
    rekognitionClient.Rekognition = jest.fn().mockReturnValue({
      detectText: jest.fn().mockResolvedValue({
        TextDetections: [
          { Confidence: 0.9, Geometry: { BoundingBox: {}, Polygon: {} } },
          { Confidence: 0.8, Geometry: { BoundingBox: {}, Polygon: {} } },
        ],
      }),
    });

    const jpegData = Buffer.from('dummyImageData', 'utf-8');

    const response = await request(app)
      .post('/upload-jpeg-bucket')
      .attach('jpeg', jpegData, 'test.jpg');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { Confidence: 0.9, Geometry: { BoundingBox: {}, Polygon: {} } },
      { Confidence: 0.8, Geometry: { BoundingBox: {}, Polygon: {} } },
    ]);
  });

  it('should respond with 500 on error', async () => {
    // Mock AWS S3 upload function to throw an error
    const AWS = require('aws-sdk');
    AWS.S3.prototype.upload = jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('AWS S3 Error')),
    });

    // Mock AWS Rekognition detectText function to throw an error
    const rekognitionClient = require('@aws-sdk/client-rekognition');
    rekognitionClient.Rekognition = jest.fn().mockReturnValue({
      detectText: jest.fn().mockRejectedValue(new Error('AWS Rekognition Error')),
    });

    const jpegData = Buffer.from('dummyImageData', 'utf-8');

    const response = await request(app)
      .post('/upload-jpeg-bucket')
      .attach('jpeg', jpegData, 'test.jpg');

    expect(response.status).toBe(500);
  });
});
