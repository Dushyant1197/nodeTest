// All API Fire in POSTMAN App

const express = require("express");
const validator = require("email-validator"); // use for email validation
const User = require("../model/user"); // import user Schema
const bcrypt = require("bcrypt"); // use for encrypt password
const jwt = require("jsonwebtoken"); // jwt middleware use for generate Token
const crypto = require("crypto"); // use for generate random number
const fs = require("fs"); // use for import file
const path = require("path");
const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../private.key"),
  "utf-8"
); // private key use in generate jwt token
const publicKey = fs.readFileSync(
  path.resolve(__dirname, "../public.key"),
  "utf-8"
); // public key use in verify user
const { sendConfirmationEmail } = require("../helper/sendMailer"); // import email send file

// create user Signup API
const userSignup = async (req, res) => {
  try {
    const code = crypto.randomInt(100000, 999999); // Generate Random Unique Code for confirmation SignUp
    const data = new User(req.body);
    const isValid = validator.validate(data.email); // email Validator
    data.code = code;
    if (isValid) {
      const password = bcrypt.hashSync(data.password, 10); // encrpt password for security
      // console.log("password;--> ", password);
      data.password = password;
      jwt.sign(
        { email: data.email },
        privateKey,
        { algorithm: "RS256" },
        function (err, token) {
          if (token) {
            data.token = token;
          } else {
            res.send(err);
          }
        }
      );
      const userData = await data.save();
      sendConfirmationEmail(data.email, data.code); // signup confirmation email function send dynamically client email
      res.send(userData); // send Data to front end when Signup Successfully
      // res.send(data.token);
    } else {
      return res.status(400).json({ error: "Email is not valid" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// create user Login API
const loginUser = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    const isAuth = bcrypt.compareSync(req.body.password, userData.password);
    if (isAuth != "null" && userData != "null") {
      jwt.sign(
        { email: userData.email },
        privateKey,
        { algorithm: "RS256" },
        function (err, token) {
          if (token) {
            res.send(token); // token send to client
            userData.token = token;
          } else {
            res.send(err);
          }
        }
      );
      userData.save();
      res.status(200).json(userData); // show in
    } else {
      res.status(401).json({ error: "Invalid User" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// create get user API
const getUserProfile = async (req, res) => {
  try {
    let token = req.get("Authorization").split("Bearer ")[1];
    token = jwt.verify(token, publicKey);
    const userData = await User.findOne({ email: token.email });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { userSignup, loginUser, getUserProfile };
