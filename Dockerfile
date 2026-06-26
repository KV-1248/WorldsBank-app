# Stage 1 — Build the app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2 — Serve the app
FROM nginx:1.27-alpine
COPY --from=build /app/dist/WorldsBank-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80