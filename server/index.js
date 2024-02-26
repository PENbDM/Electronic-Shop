import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();
import { sequelize } from "./db.js"; // Adjusted import statement
// import pool from "../server/db.js";
import models from "./models/models.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/ErrorHandlingMiddleware.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
const PORT = process.env.PORT || 5000;
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post("/payment", cors(), async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      description: "Spatula company",
      payment_method: id,
      confirm: true,
      return_url: "http://localhost:3000/cart", // Set your desired return URL here
    });
    console.log("Payment", payment);
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});
// error handler
app.use(errorHandler);
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Sserver has started on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();

// old request
// app.post("/laptop", async (req, res) => {
//   try {
//     const {
//       screen_size_inch,
//       screen_resolution,
//       processor_model,
//       processor_speed_ghz,
//       ram_size_gb,
//       storage_type,
//       storage_size_gb,
//       graphics_model,
//       optical_drive,
//       wifi_supported,
//       bluetooth_supported,
//       webcam_present,
//       operating_system,
//       weight_kg,
//       color,
//       laptops_img,
//     } = req.body;

//     const newLaptop = await pool.query(
//       `INSERT INTO laptops
//       (screen_size_inch, screen_resolution, processor_model, processor_speed_ghz, ram_size_gb, storage_type, storage_size_gb,
//       graphics_model, optical_drive, wifi_supported, bluetooth_supported, webcam_present, operating_system, weight_kg, color, laptops_img)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
//       RETURNING *`,
//       [
//         screen_size_inch,
//         screen_resolution,
//         processor_model,
//         processor_speed_ghz,
//         ram_size_gb,
//         storage_type,
//         storage_size_gb,
//         graphics_model,
//         optical_drive,
//         wifi_supported,
//         bluetooth_supported,
//         webcam_present,
//         operating_system,
//         weight_kg,
//         color,
//         laptops_img,
//       ]
//     );

//     res.json(newLaptop.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// app.post("/desktop", async (req, res) => {
//   try {
//     const {
//       processor_model,
//       processor_speed_range,
//       ram_size_gb,
//       hdd_size_gb,
//       ssd_size_gb,
//       graphics_model,
//       graphics_memory_gb,
//       optical_drive,
//       lan_supported,
//       operating_system,
//       desktops_img,
//     } = req.body;

//     const newDesktop = await pool.query(
//       `INSERT INTO desktops
//       (processor_model, processor_speed_range, ram_size_gb, hdd_size_gb, ssd_size_gb, graphics_model, graphics_memory_gb,
//       optical_drive, lan_supported, operating_system, desktops_img)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//       RETURNING *`,
//       [
//         processor_model,
//         processor_speed_range,
//         ram_size_gb,
//         hdd_size_gb,
//         ssd_size_gb,
//         graphics_model,
//         graphics_memory_gb,
//         optical_drive,
//         lan_supported,
//         operating_system,
//         desktops_img,
//       ]
//     );

//     res.json(newDesktop.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// app.post("/gpu", async (req, res) => {
//   try {
//     const {
//       chip_type,
//       card_name,
//       card_made_by,
//       memory_size_gb,
//       memory_bus_width_bits,
//       memory_type,
//       cooling_system_type,
//       graphics_cards_img,
//     } = req.body;

//     const newGraphicsCard = await pool.query(
//       `INSERT INTO graphics_cards
//       (chip_type, card_name, card_made_by, memory_size_gb, memory_bus_width_bits, memory_type, cooling_system_type, graphics_cards_img)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//       RETURNING *`,
//       [
//         chip_type,
//         card_name,
//         card_made_by,
//         memory_size_gb,
//         memory_bus_width_bits,
//         memory_type,
//         cooling_system_type,
//         graphics_cards_img,
//       ]
//     );

//     res.json(newGraphicsCard.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// app.get("/promItems", async (req, res) => {
//   try {
//     const query = `
//       SELECT
//         desktops.desktop_id,
//         desktops.processor_model,
//         desktops.processor_speed_range,
//         desktops.ram_size_gb,
//         desktops.hdd_size_gb,
//         desktops.ssd_size_gb,
//         desktops.graphics_model,
//         desktops.graphics_memory_gb,
//         desktops.optical_drive,
//         desktops.lan_supported,
//         desktops.operating_system,
//         desktops.desktops_img,
//         desktops.price,
//         desktops.promitem AS promItem
//       FROM desktops
//       WHERE desktops.promitem = true

//       UNION ALL

//       SELECT
//         laptops.laptop_id,
//         laptops.screen_size_inch,
//         laptops.screen_resolution,
//         laptops.processor_model,
//         laptops.processor_speed_ghz,
//         laptops.ram_size_gb,
//         laptops.storage_type,
//         laptops.storage_size_gb,
//         laptops.graphics_model,
//         laptops.optical_drive,
//         laptops.wifi_supported,
//         laptops.bluetooth_supported,
//         laptops.webcam_present,
//         laptops.operating_system,
//         laptops.weight_kg,
//         laptops.color,
//         laptops.laptops_img,
//         laptops.price,
//         laptops.promitem AS promItem
//       FROM laptops
//       WHERE laptops.promitem = true

//       UNION ALL

//       SELECT
//         graphics_cards.card_id,
//         graphics_cards.chip_type,
//         graphics_cards.card_name,
//         graphics_cards.card_made_by,
//         graphics_cards.memory_size_gb,
//         graphics_cards.memory_bus_width_bits,
//         graphics_cards.memory_type,
//         graphics_cards.cooling_system_type,
//         graphics_cards.graphics_cards_img,
//         graphics_cards.price,
//         graphics_cards.promitem AS promItem
//       FROM graphics_cards
//       WHERE graphics_cards.promitem = true;
//     `;

//     const result = await pool.query(query);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// old request
