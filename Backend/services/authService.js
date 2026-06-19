const { User } = require('../models');
const AppError = require('../utils/appError');
const { signToken } = require('../utils/jwt');

class AuthService {
  async registerUser({ name, email, password}) {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email address is already registered', 400);
    }

    // 2. Create user (pre-save hook hashes password)
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // 3. Remove password from the returned object
    const userJson = newUser.toJSON();
    delete userJson.password;

    // 4. Generate JWT
    const token = signToken(newUser.id, newUser.role);

    return {
      user: userJson,
      token
    };
  }

  async loginUser({ email, password }) {
    // 1. Check if email and password exist in request
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // 2. Find user & select password explicitly (since scope excludes it by default)
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    // 3. Generate token
    const token = signToken(user.id, user.role);

    // 4. Strip password out
    const userJson = user.toJSON();
    delete userJson.password;

    return {
      user: userJson,
      token
    };
  }
}

module.exports = new AuthService();
