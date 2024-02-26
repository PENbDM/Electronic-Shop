import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Corrected to split by space and get the token
    console.log(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: "No authorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ mesaage: "No authorized" });
  }
}
