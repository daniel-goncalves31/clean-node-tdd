const request = require('supertest')
const app = require('../config/app')

describe('Json Parser Middleware', () => {
  test('should enable parse body to JSON', async () => {
    app.post('/test', (req, res) => {
      res.send(req.body)
    })
    await request(app).post('/test').send({ test: 'test' }).expect({ test: 'test' })
  })
})
