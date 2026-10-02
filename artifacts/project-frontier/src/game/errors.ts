export type GameErrorCode =
  | "unauthorized"
  | "invalid_request"
  | "activity_not_found"
  | "activity_already_active"
  | "activity_not_finished"
  | "activity_not_active"
  | "equipment_not_found"
  | "invalid_equipment_slot"
  | "configuration_error"
  | "internal_error";

const statusByCode: Record<GameErrorCode, number> = {
  unauthorized: 401,
  invalid_request: 400,
  activity_not_found: 404,
  activity_already_active: 409,
  activity_not_finished: 409,
  activity_not_active: 409,
  equipment_not_found: 404,
  invalid_equipment_slot: 400,
  configuration_error: 503,
  internal_error: 500,
};

export class GameError extends Error {
  readonly status: number;

  constructor(
    readonly code: GameErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "GameError";
    this.status = statusByCode[code];
  }
}