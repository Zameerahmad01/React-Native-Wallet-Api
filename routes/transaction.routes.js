import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getSummary,
} from "../controllers/transaction.controller.js";

const router = Router();

// Route to get transactions for a user
router.get("/:userId", getTransactions);
// Route to create a new transaction
router.post("/", createTransaction);
// Route to delete a transaction
router.delete("/:id", deleteTransaction);
//Route to get summary of transactions for a user
router.get("/summary/:userId", getSummary);

// Export the router
export default router;
