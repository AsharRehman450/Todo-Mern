const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Model
const Todo = mongoose.model("Todo", new mongoose.Schema({
  text: { type: String, required: true },
}));

// Routes
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.json(todo);
});

app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.put("/todos/:id", async (req, res) => {
    const { text } = req.body;
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { text },
        { new: true, runValidators: true }
      );
      res.json(updatedTodo);
    } catch (error) {
      res.status(400).json({ error: "Update failed", details: error.message });
    }
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))