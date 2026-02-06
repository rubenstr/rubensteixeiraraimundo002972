# =========================
# Stage 1 - Build Angular
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./
RUN npm ci

# Copia todo o restante do projeto
COPY . .

# Build de produção do Angular
RUN npm run build -- --configuration production

# =========================
# Stage 2 - Servir com Nginx
# =========================
FROM nginx:alpine

# Remove configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia arquivo de configuração customizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build Angular do stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe porta 80
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
