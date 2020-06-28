const { MissingParamError } = require('../../utils/errors')

module.exports = class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    if (!this.userModel) {
      throw new Error('UserModel undefined')
    }
    if (!email) {
      throw new MissingParamError('email')
    }
    const user = await this.userModel.findOne({ email }, {
      projection: {
        password: 1
      }
    })
    return user
  }
}
