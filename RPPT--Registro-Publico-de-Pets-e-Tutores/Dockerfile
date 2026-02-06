# Stage 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx ng build RPPT--Registro-Publico-de-Pets-e-Tutores --configuration production --output-path=dist/browser --output-hashing=all

# Stage 2: Servir com Nginx
FROM nginx:alpine
COPY dist/browser/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
