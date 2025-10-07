# Use official Node.js LTS image
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . ./

# Build TypeScript
RUN npm run build

# --- Production stage ---
FROM node:20-alpine as prod
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/index.js"]
