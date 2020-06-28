const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}
let client, db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = client.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })
  test('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('valid_email@email.com')
    expect(user).toBeNull()
  })
  test('should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    const email = 'valid_email@email.com'
    await userModel.insertOne({
      email
    })
    const user = await sut.load(email)
    expect(user.email).toBe(email)
  })
})
