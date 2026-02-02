# Dockerfile para Frontend (Angular 17)

# Etapa 1: Construcción
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install && npm cache clean --force

# Copiar el código fuente
COPY . .

# Construir la aplicación Angular para producción
RUN npm run build

# Etapa 2: Servidor de producción con nginx
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist/pet-management-app/browser /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto del contenedor nginx
CMD ["nginx", "-g", "daemon off;"]
