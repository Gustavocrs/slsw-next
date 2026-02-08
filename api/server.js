/**
 * Express Server - Solo Leveling RPG API
 * Servidor backend com MongoDB
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============ MIDDLEWARE ============

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://slsw-next.vercel.app", // Adiciona seu domínio de produção
      process.env.CORS_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  }),
);

// Body Parser
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));

// Logging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} | IP: ${
      req.ip || "unknown"
    }`,
  );
  next();
});

// ============ DATABASE ============

// MONGODB DESATIVADO - USANDO FIRESTORE NO FRONTEND
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("✅ Conectado ao MongoDB");
//   })
//   .catch((err) => {
//     console.error("❌ Erro ao conectar MongoDB:", err.message);
//     // process.exit(1);
//   });

// ============ ROUTES ============

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
// const characterRoutes = require("./routes/characters");
// app.use("/api/characters", characterRoutes);

// ============ STATIC ROUTES ============

// API Documentation
app.get("/api/docs", (req, res) => {
  res.json({
    apiVersion: "1.0.0",
    endpoints: {
      characters: {
        "POST /api/characters": "Criar novo personagem",
        "GET /api/characters/user/:userId": "Listar personagens do usuário",
        "GET /api/characters/:id": "Obter personagem específico",
        "PUT /api/characters/:id": "Atualizar personagem",
        "DELETE /api/characters/:id": "Deletar personagem",
        "POST /api/characters/:id/duplicate": "Duplicar personagem",
        "GET /api/characters/:id/stats": "Obter stats calculados",
      },
    },
  });
});

// ============ ERROR HANDLING ============

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
    method: req.method,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Erro de validação",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose Cast Error
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "ID inválido",
    });
  }

  // Mongoose Duplicate Error
  if (err.code === 11000) {
    return res.status(400).json({
      error: "Dado duplicado",
      field: Object.keys(err.keyPattern)[0],
    });
  }

  // Default Error
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
  });
});

// ============ SERVER START ============

const server = app.listen(PORT, () => {
  console.log(`\n🚀 API Server rodando em http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Docs: http://localhost:${PORT}/api/docs`);
  // console.log(`🗄️  MongoDB: ${MONGODB_URI}\n`);
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("\n⏹️  Encerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor fechado");
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

module.exports = app;
