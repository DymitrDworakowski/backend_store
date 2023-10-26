const ApiError = require('../errors/ApiError')

async function register(req, res, next) {
    res.sendStatus(200);
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
