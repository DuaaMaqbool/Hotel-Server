// import User from "../models/user.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import { verifyResetOTP } from "../utils/verifyResetOTP.js";

// export const signup = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // 1. Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // 2. Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // 3. Create user
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     // 4. Save to DB
//     await newUser.save();

//     // 5. Respond
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // LOGIN CONTROLLER
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT
//     // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     //   expiresIn: "1d",
//     // });

//     // res.status(200).json({
//     //   message: "Login successful",
//     //   token,
//     //   user: {
//     //     id: user._id,
//     //     username: user.username,
//     //     email: user.email,
//     //   },
//     const token = jwt.sign(
//     { id: user._id, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   // 💡 Set the cookie
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // true in production
//     sameSite: "strict",
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//   });

//   res.json({ message: "Login successful" });
  
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

//     user.resetOTP = otp;
//     user.resetOTPExpiry = otpExpiry;
//     await user.save();

//     // Nodemailer transporter (use .env in production)
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: "youremail@gmail.com",
//       to: user.email,
//       subject: "OTP for Password Reset",
//       text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       success: true,
//       message: "OTP sent to email successfully",
//     });
//   } catch (error) {
//     console.error("Error in forgotPassword:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// export const verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     const result = verifyResetOTP(user, otp);

//     if (!result.valid) {
//       return res.status(result.code).json({ success: false, message: result.message });
//     }

//     res.status(200).json({ success: true, message: "OTP verified" });
//   } catch (error) {
//     console.error("Error in verifyOTP:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };




// export const resetPasswordController = async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   if (!email || !otp || !newPassword) {
//     return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
//   }

//   try {
//     const user = await User.findOne({ email });
//     const result = verifyResetOTP(user, otp);

//     if (!result.valid) {
//       return res.status(result.code).json({ success: false, message: result.message });
//     }

//     // Proceed to update password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;

//     user.resetOTP = undefined;
//     user.resetOTPExpiry = undefined;

//     await user.save();

//     res.status(200).json({ success: true, message: 'Password reset successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// export const resetPasswordController = async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   if (!email || !otp || !newPassword) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Email, OTP, and new password are required' 
//     });
//   }

//   try {
//     // 1. Verify OTP and get user
//     const user = await User.findOne({ email });
//     const result = verifyResetOTP(user, otp);

//     if (!result.valid) {
//       return res.status(result.code).json({ 
//         success: false, 
//         message: result.message 
//       });
//     }

//     // 2. Update password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.resetOTP = undefined;
//     user.resetOTPExpiry = undefined;
//     await user.save();

//     // 3. Send confirmation email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: '"Your App Name" <noreply@yourapp.com>',
//       to: user.email,
//       subject: "Password Changed Successfully",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #4CAF50;">Password Update Confirmation</h2>
//           <p>Your password was successfully changed on ${new Date().toLocaleString()}.</p>
//           <p>If you didn't make this change, please secure your account immediately.</p>
//           <hr style="border: 1px solid #ddd;">
//           <p style="font-size: 0.9em; color: #777;">
//             This is an automated message. Please do not reply.
//           </p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ 
//       success: true, 
//       message: 'Password reset successfully' 
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error during password reset' 
//     });
//   }
// };


// export const logoutUser = (req, res) => {
//    res
//     .clearCookie("jwt", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Lax",
//     })
//     .status(200)
//     .json({ message: "Logged out" });
// };
// export const logoutUser = (req, res) => {
//     // The name of the cookie MUST MATCH the name used during login.
//     // In your login controller, you used 'token', not 'jwt'.
//     res
//         .clearCookie("token", {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict", // Match the 'sameSite' option from the login route
//             // It's also good practice to include the 'path' if you set one
//             // path: '/',
//         })
//         .status(200)
//         .json({ message: "Logged out" });
// };



// export const checkAuth = (req, res) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({ isLoggedIn: false });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.status(200).json({ isLoggedIn: true, user: decoded });
//   } catch (err) {
//     return res.status(401).json({ isLoggedIn: false });
//   }
// };




import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { verifyResetOTP } from "../utils/verifyResetOTP.js";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 💡 CRITICAL FIX: Ensure ALL cookie options are an exact match
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/", // <-- MUST BE CONSISTENT
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: "Login successful" });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        user.resetOTP = otp;
        user.resetOTPExpiry = otpExpiry;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: "youremail@gmail.com",
            to: user.email,
            subject: "OTP for Password Reset",
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "OTP sent to email successfully",
        });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        const result = verifyResetOTP(user, otp);
        if (!result.valid) {
            return res.status(result.code).json({ success: false, message: result.message });
        }
        res.status(200).json({ success: true, message: "OTP verified" });
    } catch (error) {
        console.error("Error in verifyOTP:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const resetPasswordController = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Email, OTP, and new password are required'
        });
    }
    try {
        const user = await User.findOne({ email });
        const result = verifyResetOTP(user, otp);
        if (!result.valid) {
            return res.status(result.code).json({
                success: false,
                message: result.message
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOTP = undefined;
        user.resetOTPExpiry = undefined;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: '"Your App Name" <noreply@yourapp.com>',
            to: user.email,
            subject: "Password Changed Successfully",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Password Update Confirmation</h2>
                    <p>Your password was successfully changed on ${new Date().toLocaleString()}.</p>
                    <p>If you didn't make this change, please secure your account immediately.</p>
                    <hr style="border: 1px solid #ddd;">
                    <p style="font-size: 0.9em; color: #777;">
                        This is an automated message. Please do not reply.
                    </p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset'
        });
    }
};

// LOGOUT CONTROLLER
export const logoutUser = (req, res) => {
    res
        .clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/", // <-- MUST BE CONSISTENT
        })
        .status(200)
        .json({ message: "Logged out" });
};

export const checkAuth = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ isLoggedIn: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ isLoggedIn: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ isLoggedIn: false });
    }
};
