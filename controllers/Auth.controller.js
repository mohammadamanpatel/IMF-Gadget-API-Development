import bcrypt from "bcrypt";
import db from "../models/index.js";
const { User } = db;
import { cookieOption } from "../Jwt_Utils/Cookie.options.js";
import { Get_Token } from "../Jwt_Utils/Jwt.token.js";
import {
  DeleteData,
  GetData,
  SetData,
} from "../Redis_Cache_Handlers/Redis_handlers.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const IsUserExists = await User.findOne({ where: { email } });
    if (IsUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const Hashed_Password = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: Hashed_Password,
      role: role || "Field Agent",
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cachekey = `${process.env.AUTH_REDIS_CACHE_PREFIX}:${email}`;
    await DeleteData(cachekey);
    const Login_cache_data = await GetData(cachekey);
    console.log("Login_cache_data", Login_cache_data)
    if (Login_cache_data) {
      console.log("Serving from Redis Cache",JSON.parse(Login_cache_data));
      return res.status(200).json(JSON.parse(Login_cache_data));
    }
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const Token_Obj = { id: user.id, email: user.email, role: user.role };
    const token = Get_Token(Token_Obj);
    console.log("Token", token);
    user.token = token;
    user.password = null;
    console.log("cookieOption", cookieOption);
    res.cookie("token", token, cookieOption);
    const cookie = req.cookies;
    console.log("cookie", cookie);
    const UserData = {
      message: "User logged in",
      token,
      user,
    };
    await SetData(cachekey, process.env.REDIS_CACHE_EXPIRY, UserData);
    return res.json({ message: "Login successful", UserData });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
