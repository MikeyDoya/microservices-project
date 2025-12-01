# Build stage
FROM public.ecr.aws/docker/library/node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --include=dev

# Copy source code
COPY . .

# Build the app
RUN ./node_modules/vite/bin/vite.js build

# Production stage
FROM public.ecr.aws/docker/library/nginx:alpine

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
