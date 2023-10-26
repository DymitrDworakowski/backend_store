const uuid = require('uuid');

async function create(req, res, next) {
    const { name, price, brandId, typeId, info } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + '.jpg';
    
     try {
    const brand = await Brand.create({ name });
    return res.status(200).json(brand);
  } catch (error) {
    return next(ApiError.internal("Failed to create a Type."));
  }
}

async function getAll(req, res, next) {
 
}

async function getById(req, res, next) {
    const {id} = req.query
}


module.exports = {create, getAll,getById};
