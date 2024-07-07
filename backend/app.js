const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
// const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const rolesRoutes = require("./routes/roles.route");
const permissionsRoutes = require("./routes/permissions.route");
const usersRoutes = require("./routes/users.route");
const deepFakeRoutes = require("./routes/deep-fake.route");
const fileUploadRoutes = require("./routes/file-upload.route");
const authRoutes = require("./routes/auth.route");

const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(
    "mongodb://127.0.0.1:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.log(error);
    console.log("Connection failed!");
  });

// Replace the uri string with your connection string.
// const uri = "<connection string uri>";
// const client = new MongoClient(uri);
// async function run() {
//   try {
//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/roles", rolesRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/file-upload", fileUploadRoutes);
app.use("/api/deep-fake", deepFakeRoutes);
app.use("/api/auth", authRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
