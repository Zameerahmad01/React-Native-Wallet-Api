import express from "express";
import { config } from "dotenv";
import rateLimiter from "./middlewares/rateLimiter.js";
config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to handle rate limiting
app.use(rateLimiter);
// Middleware to parse JSON requests
app.use(express.json());

// Root route handler
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Wallet API" });
});

// Import routes
import transactionRoutes from "./routes/transaction.routes.js";
// Use routes
app.use("/api/transactions", transactionRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Add basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
