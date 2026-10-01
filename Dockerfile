FROM node:22-bookworm-slim

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app
COPY . .

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @workspace/project-frontier build

ENV NODE_ENV=production

WORKDIR /app/artifacts/project-frontier
CMD ["pnpm", "serve"]
