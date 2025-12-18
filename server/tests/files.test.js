const request = require('supertest');
const app = require('../server'); // Export your app from server.js
const mongoose = require('mongoose');

describe('File API Endpoints', () => {
    // Check if the upload endpoint responds correctly
    it('should upload a file and return 201', async () => {
        const res = await request(app)
            .post('/api/files')
            .set('Authorization', `Bearer ${testToken}`)
            .attach('files', 'tests/fixtures/test-image.jpg');

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });

    // Ensure the 404 logic we fixed stays fixed
    it('should return 404 for a non-existent file', async () => {
        const res = await request(app).get('/api/files/invalid_id');
        expect(res.statusCode).toEqual(404);
    });
});