# Dockerfile para Backend (Node.js/Express + TypeScript)
FROM node:22-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm install && npm cache clean --force

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Eliminar devDependencies para producción
RUN npm prune --production

# Exponer puerto 3000
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Comando para iniciar la aplicación
CMD ["npm", "start"]
