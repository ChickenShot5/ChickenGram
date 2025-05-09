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

router.get("/:contactId", authMiddleware, (req, res) => {
  const { contactId } = req.params;
  const stmt = db.prepare(`
    SELECT sender_id, recipient_id, content, timestamp
    FROM messages
    WHERE (sender_id = ? AND recipient_id = ?)
       OR (sender_id = ? AND recipient_id = ?)
    ORDER BY timestamp ASC
  `);
  const messages = stmt.all(req.user.id, contactId, contactId, req.user.id);
  res.json(messages);
});

router.post("/", authMiddleware, (req, res) => {
  const { recipientId, content } = req.body;

  if (!recipientId || !content) {
    return res.status(400).json({ error: "Missing recipient or content" });
  }

  const stmt = db.prepare(`
    INSERT INTO messages (sender_id, recipient_id, content)
    VALUES (?, ?, ?)
  `);
  stmt.run(req.user.id, recipientId, content);

  res.status(201).json({ message: "Message sent" });
});

module.exports = router;
