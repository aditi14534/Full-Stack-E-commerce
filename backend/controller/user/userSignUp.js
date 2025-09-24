const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

async function userSignUpController(req, res) {
  try {
    const { email, password, name, profilePic } = req.body;

    // check if user already exists
    const user = await userModel.findOne({ email });
    if (user) {
      throw new Error("User already exists.");
    }

    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");
    if (!name) throw new Error("Please provide name");

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (!hashPassword) {
      throw new Error("Something went wrong while hashing password");
    }

    // payload (include profilePic URL)
    const payload = {
      email,
      name,
      password: hashPassword,
      role: "GENERAL",
      profilePic: profilePic || "", // ✅ Cloudinary se aaya hua URL
    };

    const userData = new userModel(payload);
    const saveUser = await userData.save();

    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User created Successfully!",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
}

module.exports = userSignUpController;
