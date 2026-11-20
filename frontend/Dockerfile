# ========================================================
# DOCKERFILE MULTI-STAGE (ULTRA-LIGERO Y EFICIENTE)
# Etapa 1: Compila la aplicación React con Node
# Etapa 2: Sirve los archivos estáticos con Nginx Alpine (< 25MB RAM)
# ========================================================

# --- ETAPA 1: BUILD ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación optimizada para producción
RUN npm run build

# --- ETAPA 2: SERVIDOR NGINX ---
FROM nginx:alpine

# Copiar configuración personalizada de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados de React desde la etapa 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar servidor web Nginx
CMD ["nginx", "-g", "daemon off;"]
