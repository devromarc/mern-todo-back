const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();

// to get the data in json format
app.use(express.json());

// cors bypass
app.use(cors());

const PORT = process.env.PORT || 5500;

// mongodb connection
mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("CONNECTED TO THE DATABASE"))
  .catch((err) => console.log(err));

// import the model
const Todo = require("./models/Todo");

// creating new item
app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    item: req.body.item,
  });
  // save to data base
  todo.save();
  res.json(todo);
});

// get data from data base
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

// update the item using id
app.put("/todo/update/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body });

  todo.save();
  res.json(todo);
});

// delete an item by using the id
app.delete("/todo/delete/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);

  res.status(200).json("Item is Successfully Deleted");
});

app.get("/todo/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    todo.save();
    res.status(200).json({ message: "Item is completed", todo });
  } catch (error) {
    res.status(500).json({ message: "Error completing item", error });
  }
});

app.listen(PORT, () => console.log("SERVER IS CONNECTED"));
