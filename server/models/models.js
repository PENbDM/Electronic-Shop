import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  name: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

export const Cart = sequelize.define("cart", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

export const Cart_Product = sequelize.define("cart_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }, // Add a quantity field with a default value of 1
});
export const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false },
});

export const Type_of_product = sequelize.define("type_of_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

export const Brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

export const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

export const Product_info = sequelize.define("product_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

export const TypeBrand = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

export const Orders = sequelize.define("orders", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  totalquantity: { type: DataTypes.INTEGER, allowNull: false },
  totalprice: { type: DataTypes.INTEGER, allowNull: false },
  orderdate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export const Order_Product = sequelize.define(
  "order_product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    price: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    // Add the 'alter' option to automatically apply changes
    // to the database schema based on the model definition
    tableName: "order_products",
    sequelize,
    modelName: "Order_Product",
    timestamps: false, // If you don't want timestamps
    underscored: true, // If your column names are snake_case
    freezeTableName: true,
    alter: true,
  }
);

Orders.belongsTo(User);
User.hasMany(Orders);

Orders.belongsToMany(Product, { through: Order_Product });
Orders.belongsToMany(Product, {
  through: Order_Product,
  as: "orderProducts", // Use a unique alias, for example, "orderProducts"
  foreignKey: "orderId",
});

Product.belongsToMany(Orders, { through: Order_Product });

User.hasOne(Cart);
Cart.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Cart.hasMany(Cart_Product);
Cart_Product.belongsTo(Cart);

Type_of_product.hasMany(Product, { as: "typeOfProduct" });
Product.belongsTo(Type_of_product, { as: "typeOfProduct" });

Brand.hasMany(Product);
Product.belongsTo(Brand, { as: "brand" });

Product.hasMany(Rating);
Rating.belongsTo(Product);

Product.hasMany(Cart_Product);
Cart_Product.belongsTo(Product);

Product.hasMany(Product_info, { as: "description" });
Product_info.belongsTo(Product);

Type_of_product.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type_of_product, { through: TypeBrand });
Cart.belongsToMany(Product, { through: Cart_Product });
Product.belongsToMany(Cart, { through: Cart_Product });
const models = {
  User,
  Cart,
  Cart_Product,
  Product,
  Type_of_product,
  Brand,
  Rating,
  TypeBrand,
  Product_info,
  Order_Product,
  Orders,
};

export default models;
