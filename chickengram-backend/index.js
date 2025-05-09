const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");
const messageRoutes = require("./routes/messages");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Chickengram Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
