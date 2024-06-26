require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Specify multiple origins in an array
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000",
  "https://angelinajolie-membership.netlify.app",
  "https://cw-admin-client.netlify.app",
  "https://bts-membership.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      //Allow requests with no origin  (like module apps or curl request)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS polisy for this site does not allow access from the specific Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-type", "Authorization"],
    // Handle preflight requests
    // optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
//connect to mongodb database
const dbURI = process.env.MONGO_DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("MongoDB connected.....✅ ");
  } catch (err) {
    console.error("Error connecting to MongoDB ❌:", err, err.message);
    process.exit(1); // Exit the process if unable to connect to the database
  }
};

// import Routes from the Routes folder
const registerUserRoute = require("./src/routes/registerUserRoute");
const loginUserRoute = require("./src/routes/loginRoute");
const getUserDataRoute = require("./src/routes/getUserDataRoute");
const saveMsgRoute = require("./src/routes/saveMsgRoute");
const getChatsRoute = require("./src/routes/getChatsRoute");
const getConvoRoute = require("./src/routes/getConvoRoute");
const getAllUsersRoute = require("./src/routes/getAllUsersRoute");
const changeHasReadRoute = require("./src/routes/changeHasReadRoute");

// use Route
app.use("/api", registerUserRoute);
app.use("/api", loginUserRoute);
app.use("/api", getUserDataRoute);
app.use("/api", saveMsgRoute);
app.use("/api", getChatsRoute);
app.use("/api", getConvoRoute);
app.use("/api", getAllUsersRoute);
app.use("/api", changeHasReadRoute);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`serve runing on port ${PORT}`));
});
