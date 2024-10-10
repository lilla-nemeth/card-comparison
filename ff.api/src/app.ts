import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes"; // Changed to default import based on the instructions
const cors = require("cors");

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

import "./workers/languageSimplifierWorker";
import "./workers/extractNameWorker";
import "./workers/extractStepsWorker";
import "./workers/atomizeStepWorker";
import "./workers/generateStepImageWorker";
import "./workers/generateSuggestedStepImagesWorker";
import "./workers/generateTemplateLiteralWorker";
import "./workers/extractStepSkillsWorker";
import "./workers/extractStepResourcesWorker";
import "./workers/extractStepToolsWorker";

// console.log(myQueue)

// Initialize dotenv to use .env file variables
dotenv.config();

// Define CORS configuration
const corsConfig = { //TODO ENABLE THIS ASAP
  // origin: `https://${process.env.VITE_PASSKEY_RPID!}`,
  origin: 'https://http://localhost:7701',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');

import atomizeStepQueue from "./queues/atomizeStepQueue";
import extractNameQueue from "./queues/extractNameQueue";
import extractStepQueue from "./queues/extractStepsQueue";
import genearateStepImageQueue from "./queues/generateStepImageQueue";
import generateSuggestedStepImagesQueue from "./queues/generateSuggestedStepImagesQueue";
import languageSimplifierQueue from "./queues/languageSimplifierQueue";
import extractStepSkillsQueue from "./queues/extractStepSkillsQueue";
import extractStepToolsQueue from "./queues/extractStepToolsQueue";
import extractStepResourcesQueue from "./queues/extractStepResourcesQueue";

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(atomizeStepQueue),
  new BullAdapter(extractNameQueue),
  new BullMQAdapter(extractStepQueue),
  new BullMQAdapter(genearateStepImageQueue),
  new BullMQAdapter(generateSuggestedStepImagesQueue),
  new BullMQAdapter(languageSimplifierQueue),
  new BullMQAdapter(extractStepSkillsQueue),
  new BullMQAdapter(extractStepToolsQueue),
  new BullMQAdapter(extractStepResourcesQueue)
],
  serverAdapter: serverAdapter,
});

// Initialize express app
const app = express();

// Use CORS middleware with the defined configuration
// app.use(cors(corsConfig));
app.use(cors()); //TODO FIX CORS

// Handle OPTIONS requests globally
// app.options('*', cors(corsConfig));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a GET route '/ping' for testing the server
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

const basicAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="bull-board"');
    return res.status(401).send('Authentication required.');
  }

  // Decode base64 encoded username:password
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Replace with your desired credentials
  const validUsername = process.env.VITE_BULLMQ_ADMIN_USERNAME;
  const validPassword = process.env.VITE_BULLMQ_ADMIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    next(); // Authenticated, proceed to the bull-board
  } else {
    res.set('WWW-Authenticate', 'Basic realm="bull-board"');
    return res.status(401).send('Invalid credentials.');
  }
};

app.use('/queues', basicAuthMiddleware, serverAdapter.getRouter());
// Use the routes for authentication routes with the correct base path for API versioning
app.use("/v1", routes);

export default app;
