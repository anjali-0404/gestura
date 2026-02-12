// test/api.test.js - Simple API tests

// This file can be used with Jest or other testing frameworks
// To use: npm install --save-dev jest

/*
import app from '../app.js';

describe('API Tests', () => {
  // Health Check Test
  test('GET /api/health should return status 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Detection Test (requires file)
  test('POST /api/detect/file should detect sign language', async () => {
    const response = await request(app)
      .post('/api/detect/file')
      .attach('file', 'path/to/test/image.jpg');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('sign');
    expect(response.body.data).toHaveProperty('confidence');
  });

  // Stream Test
  test('POST /api/detect/stream should detect from base64', async () => {
    const frameData = 'base64-encoded-image-data';
    const response = await request(app)
      .post('/api/detect/stream')
      .send({ frameData });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Invalid File Test
  test('POST /api/detect/file with unsupported format should return 400', async () => {
    const response = await request(app)
      .post('/api/detect/file')
      .attach('file', 'path/to/test/document.pdf');
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
*/

console.log('Test file: Use Jest or similar testing framework to run tests');
