const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {
  users,
  getAllUsers,
  getUserById,
  getUserByName,
  getUserByEmail
} = require("./users");

const {
  posts,
  getAllPosts,
  getPostsByUser,
  getPostById,
  getPostsByTitle,
  createFakePost,
  deletePostById
} = require("./posts");

const {
  comments,
  getCommentsByPost,
  getCommentById,
  createComment,
  deleteComment
} = require("./comments");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

// ========== USERS ==========
app.get("/users", (req, res) => {
  try {
    const all = getAllUsers();
    res.json(all);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get("/users/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get("/users/name/:name", (req, res) => {
  try {
    const name = req.params.name;
    const result = getUserByName(name);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users/email/:email", (req, res) => {
  try {
    const email = req.params.email;
    const result = getUserByEmail(email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ========== POSTS ==========
app.get("/posts", (req, res) => {
  try {
    const all = getAllPosts();
    res.json(all);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get("/posts/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const post = getPostById(id);
    res.json(post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get("/posts/user/:userId", (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const userPosts = getPostsByUser(userId);
    res.json(userPosts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get("/posts/title/:title", (req, res) => {
  try {
    const title = req.params.title;
    const result = getPostsByTitle(title);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/posts", (req, res) => {
  try {
    const { userId, title, body } = req.body;
    createFakePost(userId, title, body);
    res.status(201).json({ message: "Post criado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/posts/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    deletePostById(id);
    res.json({ message: "Post deletado com sucesso!" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ========== COMMENTS ==========
app.get("/comments/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const comment = getCommentById(id);
    res.json(comment);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get("/comments/post/:postId", (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const result = getCommentsByPost(postId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post("/comments", (req, res) => {
  try {
    const { postId, author, text } = req.body;
    const newComment = createComment(postId, author, text);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/comments/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    deleteComment(id);
    res.json({ message: "Comentário deletado com sucesso!" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ========== SERVER ==========
app.get("/", (req, res) => {
  res.send("🚀 API local rodando com sucesso!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});