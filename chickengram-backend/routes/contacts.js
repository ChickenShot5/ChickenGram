const express = require("express");
const db = require("../models/db");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET = "chickensecret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

router.get("/", authMiddleware, (req, res) => {
  const stmt = db.prepare(`
    SELECT u.id, u.username
    FROM contacts c
    JOIN users u ON c.contact_id = u.id
    WHERE c.user_id = ?
  `);
  const contacts = stmt.all(req.user.id);
  res.json(contacts);
});

router.post("/", authMiddleware, (req, res) => {
  const { username } = req.body;

  const userStmt = db.prepare("SELECT id FROM users WHERE username = ?");
  const contact = userStmt.get(username);

  if (!contact) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const insert = db.prepare(
      "INSERT INTO contacts (user_id, contact_id) VALUES (?, ?)"
    );
    insert.run(req.user.id, contact.id);
    res.status(201).json({ message: "Contact added" });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      res.status(400).json({ error: "Already added" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
});

router.delete("/:id", authMiddleware, (req, res) => {
  const contactId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = db
      .prepare("DELETE FROM contacts WHERE user_id = ? AND contact_id = ?")
      .run(userId, contactId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Contact not found or unauthorized" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ error: "Server error while deleting contact" });
  }
});


module.exports = router;
