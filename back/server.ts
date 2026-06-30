import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { FRONTEND_DEV_PORT, FRONTEND_PROD_PORT, PORT } from "./src/constants";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? FRONTEND_DEV_PORT
        : FRONTEND_PROD_PORT,
    credentials: true,
  }),
);

// Serve assets folder physically stored on server locally
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// General health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "online", project: "Invenio Nexus Backend" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server up and running at http://localhost:${PORT}`);
});
