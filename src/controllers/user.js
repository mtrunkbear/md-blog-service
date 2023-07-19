const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.fetchAll();
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  const id = req.user.id || req.params.id;
  try {
    const user = await User.fetchById({ id: id });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.user.id || req.params.id;
  const { nickName, firstName, lastName, avatarUrl, description, occupation } =
    req.body;
  try {
    const user = await User.fetchById({ id: id });
    const userUpdated = await user.update({
      nickName,
      firstName,
      lastName,
      avatarUrl,
      description,
      occupation,
    });
    return res.status(200).json(userUpdated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
