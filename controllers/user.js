const ApiError = require('../errors/ApiError')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => {
return jwt.sign({ id, email, role }, process.env.SECRET_KEY,
        {expiresIn: '10h'});
}

async function register(req, res, next) {
    try{
    const { email, password, role } = req.body;
    if (!email || !password) {
        return next(ApiError.badRequest('Incored password or email'))
    }
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('User alredy add'))
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email,password:hashPassword,role});
        const basket = await Basket.create({ userId: user.id });
        const token = generateJwt(user.id, user.email, user.role);
    
    return res.status(201).json({token});
    } catch (err) {
        return next(ApiError.badRequest('ERROR'))
    }
}


async function login(req, res, next) {

}

async function check(req, res, next) {
    const { id } = req.query;
    if (!id) {
        return next(ApiError.badRequest('No id!'))
    }
    res.json(id);
}

module.exports = {register, login,check};
