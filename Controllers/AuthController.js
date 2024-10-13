import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    let user = await User.findOne({ email }); // Corrected method name to findOne (case-sensitive)

    if (user) {
      return res.status(400).json({
        message: "User Email Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Use a higher salt rounds value for better security.
    const otp = Math.floor(Math.random() * 1000000);
    //create new user data
    user = { name, email, hashedPassword, contact };
    // Create signed activation token
    const activationToken = jwt.sign(
      { user, otp }, // Include email instead of user object for clarity.
      process.env.ACTIVATION_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const message = `Please Verify Your Account ${otp}`;
    const subject = "Welcome to Our Service";

    // Send Email to User
    await sendMail(email, subject, message);

    return res.status(200).json({
      message: "OTP sent to your email",
      activationToken,
    });
  } catch (error) {
    console.error(error); // Log error for debugging purposes.
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const registerUserpost = async (req, res) => {
  return res.send("<h1>Hello Roopan</h1>");
};
export const verifyUser = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;
    const verify = jwt.verify(
      activationToken,
      process.env.ACTIVATION_TOKEN_SECRET
    );
    if (!verify) {
      return res.json({ message: "otp Expired" });
    }
    if (verify.otp !== otp) {
      return res.json({ message: "Wrong OTP" });
    }

    await User.create({
      name: verify.user.name,
      email: verify.user.email,
      password: verify.user.hashedPassword,
      contact: verify.user.contact,
    });
    return res.status(200).json({
      message: "User Registration Success",
    });
  } catch (error) {
    console.error(error); // Log error for debugging purposes.
    return res.status(500).json({
      message: error.message,
    });
  }
};

//login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }); // Corrected method name to findOne (case-sensitive)

    if (!user) {
      return res.status(400).json({
        message: "User Invalid credentials",
      });
    }
    // check hash password
    const matchpassword = await bcrypt.compare(password, user.password);
    if (!matchpassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    //Genarate signed token
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    //Exclude te password feild befre sending the response
    const { password: userPassword, ...userDetails } = user.toObject();
    return res.status(200).json({
      message: "Welcome" + user.name,
      token,
      user: userDetails,
    });
  } catch (error) {
    console.error(error); // Log error for debugging purposes.
    return res.status(500).json({
      message: error.message,
    });
  }
};


