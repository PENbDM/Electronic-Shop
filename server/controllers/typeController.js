import { Type_of_product } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type_of_product.create({ name });
    return res.json(type);
  }
  async getAll(req, res) {
    const types = await Type_of_product.findAll();
    return res.json(types);
  }
}

export default new TypeController();
