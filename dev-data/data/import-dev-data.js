const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../models/tourModel");

dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.DATABASE_STRING.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log("db connected");
});

// read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"),
);

// import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("data successfully loaded!");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

// delete data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("data successfully deleted!");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

if (process.argv.at(2) === "--import") {
  importData();
} else if (process.argv.at(2) === "--delete") {
  deleteData();
}
