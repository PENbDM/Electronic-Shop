import { Brand } from "../models/models.js";

class BrandController {
  async create(req, res) {
    try {
      const { name } = req.body;

      // Check if the brand name already exists
      const existingBrand = await Brand.findOne({ where: { name } });

      if (existingBrand) {
        // Brand name already exists, handle it accordingly
        return res
          .status(400)
          .json({ error: "Brand with this name already exists." });
      }

      // Brand name doesn't exist, proceed with creating a new brand
      const type = await Brand.create({ name });
      return res.json(type);
    } catch (error) {
      // Handle other errors
      console.error("Error creating brand:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async getAll(req, res) {
    const types = await Brand.findAll();
    return res.json(types);
  }
}

export default new BrandController();
