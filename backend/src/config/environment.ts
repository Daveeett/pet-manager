import dotenv from "dotenv";
import env from "env-var";

// Cargar variables de entorno desde .env
dotenv.config();

export interface EnvConfig {
  server: {host: string; port: number; nodeEnv: string;};
  encryption: {key: string;};
  isDevelopment: boolean;
}

// Configuración exportada con validaciones usando env-var
export const config: EnvConfig = {
  server: {
    host: env.get("HOST").required().asString(),
    port: env.get("PORT").required().asPortNumber(),
    nodeEnv: env.get("NODE_ENV").required().asString(),
  },
  encryption: {
    key: env.get("ENCRYPTION_KEY").required().asString(),
  },
  isDevelopment: env.get("NODE_ENV").asString() === "development"
};

// Mantener compatibilidad con código existente 
export const ENV = {
  HOST: config.server.host,
  PORT: config.server.port,
  NODE_ENV: config.server.nodeEnv,
  ENCRYPTION_KEY: config.encryption.key,
  isDevelopment: config.isDevelopment
} as const;
