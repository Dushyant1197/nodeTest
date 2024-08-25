const express = require("express");
const route = express.Router();

const userProfileController = require("../controller/user");
// create route using Router()
route.get("/profile", userProfileController.getUserProfile);

module.exports = route;
