const request = require('supertest')
const app = require('../config/app')

describe('Content-Type Middleware', () => {
  test('should return json content-type as default', async () => {
    app.get('/test_json', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test_json')
      .expect('content-type', /json/)
  })
  test('should return json content-type as default', async () => {
    app.get('/test_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_xml')
      .expect('content-type', /xml/)
  })
})
