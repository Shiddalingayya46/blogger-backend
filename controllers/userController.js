const bcrypt = require("bcrypt");
const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash(password, saltRounds);

   const user = new User({ name, email, password: hashedPassword });
   await user.save();

   const { password: _, ...userWithoutPassword } = user.toObject();
   res.status(201).json(userWithoutPassword);
   } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: `user not found with email ${email}` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return res.status(200).json({
      message: "success",
      userDetails: { userId: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId: ", userId);
    if (!userId) {
      return res.status(400).json({
        message: "userId not present in params",
      });
    }
    const { name, imageBase64, contentType } = req.body;


    const user = await User.findById(userId);
    console.log("user: ", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }
    if (imageBase64 && contentType) {
      user.profilePicture = {
        data: Buffer.from(imageBase64, "base64"),
        contentType,
      };
    }
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    res.json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

  const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    if (!userId) {
      return res.status(404).json({ message: "userId missing in params" });
    }

    const user = await User.findById(userId).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  login,
  updateUser,
  getUserById,
};
