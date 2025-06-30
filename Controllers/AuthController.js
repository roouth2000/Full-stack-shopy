import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";

const validatePassword = (password) => {
  const minLength = 8;
  const hasLetter = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (password.length < minLength) {
    return "Password must be at least 8 characters long";
  }
  if (!hasLetter) {
    return "Password must contain at least one lowercase letter";
  }
  if (!hasUpperCase) {
    return "Password must contain at least one uppercase letter";
  }
  if (!hasNumber) {
    return "Password must contain at least one number";
  }
  if (!hasSpecial) {
    return "Password must contain at least one special character";
  }

  return null;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User Email Already Exists",
      });
    }

    const errorMessage = validatePassword(password);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(Math.random() * 1000000);

    user = { name, email, hashedPassword, contact };

    const activationToken = jwt.sign(
      { user, otp },
      process.env.ACTIVATION_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const message = `Please Verify Your Account ${otp}`;
    const subject = "Welcome to Our Service";

    await sendMail(email, subject, message);

    return res.status(200).json({
      message: "OTP sent to your email",
      activationToken,
    });
  } catch (error) {
    console.error(error);
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


