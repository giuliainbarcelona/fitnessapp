require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var authRouter = require("./routes/auth");
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
var workoutRouter = require("./routes/workouts");
var exerciseRouter = require("./routes/exercises")

var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

app.use("/api/auth", authRouter);
app.use("/api/exercises", exerciseRouter);
app.use("/api/workouts", workoutRouter);


module.exports = app;
