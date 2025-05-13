import User from "../Models/User.js";

export const UserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({
        user,
      });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  };