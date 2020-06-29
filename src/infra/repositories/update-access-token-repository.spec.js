const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return {
    sut,
    userModel
  }
}

describe('UpdateAccessTokenRepository', () => {
  let mockUserId

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
    const userModel = db.collection('users')
    const mockUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      password: 'hashed_password',
      name: 'John Doe'
    })
    mockUserId = mockUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should update the user with given accessToken', async () => {
    const { sut, userModel } = makeSut()
    await sut.update(mockUserId, 'valid_token')
    const updatedUser = await userModel.findOne({ _id: mockUserId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })
  test('should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update(mockUserId, 'valid_token')
    expect(promise).rejects.toThrow()
  })
  test('should throw if no params are provided', async () => {
    const { sut } = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(mockUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
