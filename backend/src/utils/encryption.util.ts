import * as crypto from "crypto";
import { ENV } from "../config/environment";

// Utilidad para encriptar y desencriptar datos sensibles 
const KEY = crypto.scryptSync(ENV.ENCRYPTION_KEY, "salt", 32);
const ALGORITHM = "aes-256-cbc";

export function encrypt(text: string): string {
  // Genera una llave aleatoria
  const iv = crypto.randomBytes(16);

  // Crea una maquina de cifrado con mi clave
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  // "utf8" es el formato de codificación del texto(caracteres normales)
  // "hex" es el formato de codificación del texto encriptado
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  //cifra el ultimo bloque

  // Retorna datos en formato hexadecimal
  return `${iv.toString("hex")}:${encrypted}`;

}

// Desencripta un texto previamente encriptado
 
export function decrypt(encryptedText: string): string {
  try {
    // Separar IV y datos encriptados
    const [ivHex, encryptedData] = encryptedText.split(":");

    if (!ivHex || !encryptedData) {
      throw new Error("Formato de encriptación inválido");
    }

    // Recrea la llave aleatoria
    const iv = Buffer.from(ivHex, "hex");

    // Crear maquina de descifrado
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

    // Descifra el texto
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;

  } catch (error) {
    console.error("Error al desencriptar:", error);
    return encryptedText; // retorna el texto original si falla
  }
}
