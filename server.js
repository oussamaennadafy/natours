const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_STRING.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log("db connected");
});

const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("✋ SIGTERM RECEIVED Shutting down gracefully!");
  server.close(() => {
    console.log("💥 process terminated!");
  });
});
