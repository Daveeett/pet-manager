import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import petRoutes from "./routes/pet/pet.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { ENV } from "./config/environment";

const app: Application = express();
const PORT = ENV.PORT;
const HOST = ENV.HOST;
app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parsear JSON en el body de las peticiones
app.use(express.json());

// Parsear datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

// Logger simple de peticiones
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

//Rutas
app.use("/api/pets", petRoutes);

//middlewares de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutando en http://${HOST}:${PORT}`);
  console.log(`Entorno: ${ENV.NODE_ENV}`);
});

export default app;
