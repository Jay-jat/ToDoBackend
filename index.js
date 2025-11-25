const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let todos = JSON.parse(fs.readFileSync("todos.json", "utf-8"));

  res.render("home", { todos });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/new", (req, res) => {
  let { title } = req.body;
  let todos = JSON.parse(fs.readFileSync("todos.json", "utf-8"));

  let id = uuidv4();

  todos.push({ id, title, completed: false });

  fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2));

  res.redirect("/");
});

app.get("/todo/:id/edit", (req, res) => {
  let todos = JSON.parse(fs.readFileSync("todos.json", "utf-8"));
  let todo = todos.find((t) => t.id === req.params.id);
  res.render("edit", { todo });
});

app.put("/todo/:id", (req, res) => {
  let todos = JSON.parse(fs.readFileSync("todos.json", "utf-8"));
  let todo = todos.find((t) => t.id === req.params.id);
  todo.title = req.body.title;
  fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2));
  res.redirect("/");
});
app.delete("/todo/:id", (req, res) => {
  let todos = JSON.parse(fs.readFileSync("todos.json", "utf-8"));
  todos = todos.filter((todo) => todo.id !== req.params.id);
  fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2));
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server Started");
});
