import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import subcategoryRoutes from "./routes/subcategoryRoutes.js";
import cors from "cors";
import path from "path";
dotenv.config();
connectDB();
const app = express();

const _dirname = path.resolve();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ADD THIS: Serve static files from the "uploads" folder
app.use("/uploads", express.static("uploads"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/subcategory", subcategoryRoutes);

app.use(express.static(path.join(_dirname, "/client/build")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "client", "build", "index.html"));
});
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommmerce App</h1>");
});

//Port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(`Server is runnig on ${PORT}`);
});
