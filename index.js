const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Permit frontend access
app.use(express.json()); // Parse JSON
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// API Routes
const aiRoutes = require("./routes/aiRoutes");
app.use("/api", aiRoutes); // Prefix routes with "/api" for clarity

// Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

// For local development: Start the server
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel serverless function
module.exports = app;
