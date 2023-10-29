const ApiError = require("../errors/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
};

async function register(req, res, next) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Email or password is wrong"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("User alredy add"));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, password: hashPassword, role });
    const basket = await Basket.create({ userId: user.id });
    // const token = generateJwt(user.id, user.email, user.role);

    return res.status(201).json({ user, basket });
  } catch (err) {
    return next(ApiError.badRequest("ERROR"));
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.badRequest("User not found!"));
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest("Email or password is wrong"));
    }
    const token = generateJwt(user.id, user.email, user.role);
    const response = {
      user: {
        email: user.email,
        role: user.role,
        // Не включати поле password
      },
      token: token, // Повернути токен у відповіді
    };
    return res.status(200).json(response);
  } catch (err) {
    return next(ApiError.internal("Error"));
  }
}

async function logout(req, res, next) {
  console.log(req.id);
  try {
    await User.findOne(req.user.id, { token: null });

    res.status(204);
  } catch (err) {
    next(err);
  }
}

async function check(req, res, next) {
  const token = generateJwtToken(req.user.id, req.user.email, req.user.role);
  return res.json({ token });
}

module.exports = { register, login, check, logout };
