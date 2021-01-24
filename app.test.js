'use strict';

const request = require('supertest');
const app = require('./app');

describe('Test the things service', () => {
    test('GET /recent succeeds', () => {
        return request(app)
	    .get('/recent')
	    .expect(200);
    });

    test('GET /recent returns JSON', () => {
        return request(app)
	    .get('/recent')
	    .expect('Content-type', /json/);
    })
    test('GET /allplaces succeeds', () => {
        return request(app)
	    .get('/allplaces')
	    .expect(200);
    });

    test('GET /allplaces returns JSON', () => {
        return request(app)
	    .get('/allplaces')
	    .expect('Content-type', /json/);
    })
    test('GET /allplaceslist succeeds', () => {
        return request(app)
	    .get('/allplaceslist')
	    .expect(200);
    });

    test('GET /allplaceslist returns JSON', () => {
        return request(app)
	    .get('/allplaceslist')
	    .expect('Content-type', /json/);
    })

    test('GET /allpictures succeeds', () => {
        return request(app)
	    .get('/allpictures')
	    .expect(200);
    });

    test('GET /allpictures returns JSON', () => {
        return request(app)
	    .get('/allpictures')
	    .expect('Content-type', /json/);
    })
})
