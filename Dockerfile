# Build Image
FROM node:20.6.1-bullseye-slim as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build



# Optimize for production
FROM node:20.6.1-bullseye-slim as optimizer
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app
RUN npm install --omit=dev
RUN apt-get -y update && apt-get -y install curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh && node-prune 

# Production

FROM gcr.io/distroless/nodejs20-debian11
WORKDIR /app
COPY --from=optimizer /app/node_modules /node_modules
COPY --from=optimizer /app/dist/ ./ 

CMD ["./index.mjs"]

