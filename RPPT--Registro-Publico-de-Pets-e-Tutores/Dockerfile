# Stage 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar todo o projeto
COPY . .

# Gerar build de produção
RUN npx ng build RPPT--Registro-Publico-de-Pets-e-Tutores --configuration=production

# Stage 2: Servir com Nginx
FROM nginx:1.26-alpine

# Remover configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuração personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build Angular
COPY --from=build /app/dist/RPPT--Registro-Publico-de-Pets-e-Tutores /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Rodar Nginx em foreground
CMD ["nginx", "-g", "daemon off;"]
