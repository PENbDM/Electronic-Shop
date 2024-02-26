import ApiError from "../error/ApiError.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs"; // Change the import
import jwt from "jsonwebtoken";
import { User, Cart } from "../models/models.js";

const generateJwt = (id, email, role, name) => {
  return jwt.sign({ id, email, role, name }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role, name } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Wrong password or email"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("User with this email already exist"));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      role,
      name,
      password: hashPassword,
    });
    const cart = await Cart.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role, user.name);
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    return res.json({ token, userWithoutPassword });
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("User with this email does not exist"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Wrong password"));
    }
    const token = generateJwt(user.id, user.email, user.role, user.name);
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return res.json({ token, userWithoutPassword });
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    res.json({
      token,
    });
  }
}

export default new UserController();
