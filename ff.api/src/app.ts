import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes"; // Changed to default import based on the instructions

// Initialize dotenv to use .env file variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a GET route '/ping' for testing the server
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Define a GET route for the root path '/'
app.get("/", (req, res) => {
  res.status(200).send("this is an API that works!");
});

app.get("*", function (req, res) {
  res.redirect("/");
});

export default app;
