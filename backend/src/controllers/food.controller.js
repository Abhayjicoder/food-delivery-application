const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer.toString("base64"), // ✅ Important
      uuid()
    );

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      video: fileUploadResult.url,
      videoFileId: fileUploadResult.fileId || fileUploadResult.file_id || null,
      foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
      message: "Food created successfully",
      food: foodItem,
    });
  } catch (error) {
    console.error("Error creating food:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({ user: user._id, food: foodId });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
      return res.status(200).json({ message: "Food unliked successfully" });
    }

    const like = await likeModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

    res.status(201).json({ message: "Food liked successfully", like });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({ user: user._id, food: foodId });

    if (isAlreadySaved) {
      await saveModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });
      return res.status(200).json({ message: "Food unsaved successfully" });
    }

    const save = await saveModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

    res.status(201).json({ message: "Food saved successfully", save });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getSaveFood(req, res) {
  const user = req.user;
  const savedFoods = await saveModel.find({ user: user._id }).populate('food');

  if (!savedFoods || savedFoods.length === 0) {
    return res.status(404).json({ message: "No saved foods found" });
  }

  res.status(200).json({
    message: "Saved foods retrieved successfully",
    savedFoods,
  });
}

async function getPartnerFoods(req, res) {
  try {
    const partner = req.foodPartner;
    if (!partner) return res.status(401).json({ message: 'Unauthorized' });

    const foods = await foodModel.find({ foodPartner: partner._id });
    res.status(200).json({ message: 'Partner foods fetched', foods, partnerId: partner._id });
  } catch (error) {
    console.error('Error fetching partner foods', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteFood(req, res) {
  try {
    const partner = req.foodPartner;
    const foodId = req.params.id;

    const foodItem = await foodModel.findById(foodId);
    if (!foodItem) return res.status(404).json({ message: 'Food not found' });

    if (!partner || foodItem.foodPartner.toString() !== partner._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this food' });
    }

    // Attempt to remove the file from external storage if we have an id
    try {
      if (foodItem.videoFileId) {
        await storageService.deleteFile(foodItem.videoFileId);
      }
    } catch (err) {
      // log and continue with DB deletion
      console.error('Failed to delete remote file for food:', foodId, err);
    }

    await foodModel.findByIdAndDelete(foodId);

    res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
    console.error('Error deleting food', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateFood(req, res) {
  try {
    const partner = req.foodPartner;
    const foodId = req.params.id;
    const { name, description, price } = req.body;

    const foodItem = await foodModel.findById(foodId);
    if (!foodItem) return res.status(404).json({ message: 'Food not found' });

    if (!partner || foodItem.foodPartner.toString() !== partner._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this food' });
    }

    const updated = await foodModel.findByIdAndUpdate(foodId, { 
      $set: { 
        name, 
        description,
        ...(price !== undefined && { price: parseFloat(price) })
      } 
    }, { new: true });
    res.status(200).json({ message: 'Food updated', food: updated });
  } catch (error) {
    console.error('Error updating food', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
  getPartnerFoods,
  deleteFood,
  updateFood,
};
