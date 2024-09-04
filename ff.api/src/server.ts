import app from "./app";

const PORT = process.env.VITE_FFAPI_PORT || 3001; // Fallback to 3001 if PORT is not defined

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Failed to start server:", error.message, error.stack);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log("Shutting down gracefully...");
      server.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
          process.exit(1);
        }
        process.exit(0);
      });
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (error) {
    console.error(
      "Failed to start server:",
      error instanceof Error ? error.message : error
    );
    process.exit(1); // Exit with a failure code
  }
};

startServer();
