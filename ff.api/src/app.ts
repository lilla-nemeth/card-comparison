import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import routes from "./routes/routes";
import cors from "cors";
import RecipeModel from "./models/recipeModel";
// Initialize dotenv to use .env file variables
dotenv.config();

// Initialize express app
const app = express();


//connect DB
connectDB();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
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
