import "server-only";
import { getDatabase } from "../database/client";
import { PostgresGameRepository } from "../database/repository";
import { GameService } from "../game/service";

let service: GameService | undefined;

export function getGameService(): GameService {
  if (!service) {
    service = new GameService(new PostgresGameRepository(getDatabase()));
  }
  return service;
}