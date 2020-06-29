const MongoHelper = require('../helpers/mongo-helper')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

describe('UpdateAccessTokenRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should update the user with given accessToken', async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository(userModel)
    const mockUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      password: 'hashed_password',
      name: 'John Doe'
    })
    await sut.update(mockUser.ops[0]._id, 'valid_token')
    const updatedUser = await userModel.findOne({ _id: mockUser.ops[0]._id })
    expect(updatedUser.accessToken).toBe('valid_token')
  })
  test('should throw if no userModel is provided', async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository()
    const mockUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      password: 'hashed_password',
      name: 'John Doe'
    })
    const promise = sut.update(mockUser.ops[0]._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })
})
