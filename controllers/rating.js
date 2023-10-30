const { Rating, Device, User } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function create(req, res, next) {
  try {
    const { deviceId, userId, rate } = req.body;

    const device = await Device.findOne({ where: { id: deviceId } });
    const user = await User.findOne({ where: { id: userId } });
    if (!device) {
      return next(ApiError.badRequest("Device not found"));
    }
    if (!user) {
      return next(ApiError.badRequest("User not found"));
    }
    const ratings = await Rating.create({
      rate,
      deviceId: device.id,
      userId: user.id,
    });
    return res.json(ratings);
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}

async function deleteRating(req, res, next) {
  const { id } = req.params;
  try {
    await Rating.destroy({
      where: { id },
    });
    return res.status(204).json({ message: "Rating has been deleted !" });
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}

async function updateRating(req, res, next) {
  const { id } = req.params;
  
  try {
    // Знаходимо рейтинг за заданим id
    const rating = await Rating.findOne({ where: { id } });
    
    if (!rating) {
      return next(ApiError.notFound("Rating not found"));
    }

    // Оновлюємо рейтинг на нове значення (за переданим у запиті rate)
    const { rate } = req.body;
    await rating.update({ rate });

    return res.status(200).json(rating);
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}
module.exports = { create, deleteRating, updateRating };
