const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const { body } = req;
  console.log({ body });
  try {
    const post = new Post(
      req.body.title,
      req.body.content,
      undefined,
      req.body.userId
    );
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.fetchAll();
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.fetchByUserId(req.params.id);
    if (!posts) {
      res.status(404).json({ error: "Posts not founds" });
    } else {
      res.status(200).json(posts);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.fetchById(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.fetchById(req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
    } else {
      post.title = title || post.title;
      post.content = content || post.content;
      const updatedTask = await post.save();
      res.status(200).json(updatedTask);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.fetchById(req.params.id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
    } else {
      await post.delete();
      res.status(204).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
