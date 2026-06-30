import express from "express";
import path from "path";
import { PORT } from "./src/constants";

const app = express();

// Base request parsers middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve assets folder physically stored on server locally
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// General health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "online", project: "Invenio Nexus Backend" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server up and running at http://localhost:${PORT}`);
});
