const dotenv = require("dotenv").config();
const port = process.env.port || 9090;
const express = require("express");
const app = express();
const db = require("./db"); // import Dtatbase config file
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const publicKey = fs.readFileSync(
  path.resolve(__dirname, "./public.key"),
  "utf-8"
);
dotenv;
const userRoute = require("./routes/user");

app.use(morgan("dev"));
app.use(express.json({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
db();

const Auth = (req, res, next) => {
  const token = req.get("Authorization").split("Bearer ")[1];
  // console.log("-----token-----", token);
  let decode = jwt.verify(token, publicKey);
  // console.log("------------decode.email------------", decode.email);
  if (decode.email) {
    // console.log("------------IN--------------");
    next();
  } else {
    res.status(400).json({ error: "User UnAuthorised" });
  }
};
app.use("/", userRoute); // signup and login route

const profileRoute = require("./routes/userProfile");
app.use("/", Auth, profileRoute); // user profile route

//  use for server start
app.listen(port, () => {
  console.log(`Server Started on ${port}`);
});
