const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const userController = require("../controllers/user");
const validateUserId = require("../middlewares/validateUserId");
const  validateJWT  = require("../middlewares/validateJWT");

router.post("/post",validateJWT,validateUserId, postController.createPost);
router.get("/post", postController.getPosts);
router.get("/post/:id", postController.getPost);
router.get("/post/user/:id", postController.getPostsByUser);
router.put("/post/:id", postController.updatePost);
router.delete("/post/:id", postController.deletePost);

router.get("/users", userController.getUsers);
router.put("/users/:id", validateJWT, validateUserId, userController.updateUser);
router.put("/users/me", validateJWT, validateUserId, userController.updateUser);
router.get("/users/me",validateJWT, userController.getUser);

module.exports = router;
