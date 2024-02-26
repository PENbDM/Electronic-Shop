import {
  Product,
  Product_info,
  Brand,
  Type_of_product,
} from "../models/models.js";
import ApiError from "../error/ApiError.js";

class ProductController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeOfProductId, description, img } =
        req.body;

      const product = await Product.create({
        name,
        price,
        brandId,
        typeOfProductId,
        img,
      });
      if (description) {
        console.log(description);
        // descriptionParse = JSON.parse(description);
        const productInfoPromises = description.map((i) =>
          Product_info.create({
            title: i.title,
            description: i.description,
            productId: product.id,
          })
        );
        console.log(description);
        await Promise.all(productInfoPromises);
      }
      return res.json(product);
    } catch (err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeOfProductId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 30;
    let offset = page * limit - limit;
    //req query f
    let product;
    if (!brandId && !typeOfProductId) {
      product = await Product.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeOfProductId) {
      product = await Product.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }
    if (!brandId && typeOfProductId) {
      product = await Product.findAndCountAll({
        where: { typeOfProductId },
        limit,
        offset,
        include: [
          { model: Brand, attributes: ["name"], as: "brand" },
          { model: Type_of_product, attributes: ["name"], as: "typeOfProduct" },
        ],
      });
    }
    if (brandId && typeOfProductId) {
      product = await Product.findAndCountAll({
        where: { typeOfProductId, brandId },
        limit,
        offset,
      });
    }
    return res.json(product);
  }

  async getOne(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findOne({
        where: { id },
        include: [
          { model: Product_info, as: "description" },
          { model: Brand, attributes: ["name"], as: "brand" },
          { model: Type_of_product, attributes: ["name"], as: "typeOfProduct" },
        ],
      });
      return res.json(product);
    } catch (error) {
      // Обработка ошибок
      console.error("Error fetching product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new ProductController();
