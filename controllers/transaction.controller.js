import { db } from "../lib/prisma.js";

export const createTransaction = async (req, res) => {
  try {
    const { userId, amount, title, category } = req.body;

    if (!userId || amount === undefined || !title || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction = await db.transaction.create({
      data: {
        userId,
        amount,
        title,
        category,
      },
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.log("Error in createTransaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.log("Error in getTransactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    const transaction = await db.transaction.delete({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      transaction,
    });
  } catch (error) {
    console.log("Error in deleteTransaction:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const transactions = await db.transaction.findMany({
      where: { userId },
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions found for this user" });
    }

    const balance = transactions.reduce(
      (sum, transaction) =>
        parseFloat((sum + parseFloat(transaction.amount)).toFixed(2)),
      0
    );
    const income = transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce(
        (sum, transaction) =>
          parseFloat((sum + parseFloat(transaction.amount)).toFixed(2)),
        0
      );
    const expenses = transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce(
        (sum, transaction) =>
          parseFloat((sum + parseFloat(transaction.amount)).toFixed(2)),
        0
      );

    return res.status(200).json({
      success: true,
      summary: {
        balance,
        income,
        expenses,
      },
    });
  } catch (error) {
    console.log("Error in getSummary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
