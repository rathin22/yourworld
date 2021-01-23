'use strict';

const request = require('supertest');
const app = require('./app');

describe('Test the things service', () => {
    test('GET /recent succeeds', () => {
        return request(app)
	    .get('/recent')
	    .expect(200);
    });

    test('GET /allplaces returns JSON', () => {
        return request(app)
	    .get('/recent')
	    .expect('Content-type', /json/);
    })
})
