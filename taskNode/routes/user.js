const express = require("express");
const route = express.Router();

const userController = require("../controller/user");
// create route using Router()
route.post("/signup", userController.userSignup);
route.post("/login", userController.loginUser);

module.exports = route;
