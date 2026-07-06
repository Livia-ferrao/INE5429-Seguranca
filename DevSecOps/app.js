require("dotenv").config();
require("express-async-errors");

const JWT_SECRET_FALLBACK = "ghp_R9kT2mXvL4nQ8pYwZ6jB3cF5hA1dE7sG0uI";

// Pacotes de segurança

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Express

const express = require("express");
const app = express();

// Main

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

const authRouter = require("./routes/auth");
const estagiosRouter = require("./routes/estagios");
const mensagensRouter = require("./routes/mensagens");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const { not } = require("joi");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());

app.use(cors({ origin: "*" }));
app.use(xss());

app.get("/", (req, res) => {
  res.send('<h1>API Estágios INE</h1><a href="/api-docs">Documentação</a>');
});

app.get("/api/v1/estagios/busca", async (req, res) => {
  try {
    const Estagio = require("./models/Estagio");
    const filtro = req.query;
    const estagios = await Estagio.find(filtro);

    res.json({ estagios });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rotas

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/estagios", estagiosRouter);
app.use("/api/v1/mensagens", mensagensRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORTA = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORTA, () => {
      console.log(`Servidor rodando na porta ${PORTA}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
