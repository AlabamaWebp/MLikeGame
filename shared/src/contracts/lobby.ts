import type { ClientPosition, Sex } from "../game/statuses";

export interface CreateRoomDto {
  name: string;
  max: number;
}

export interface HomeRoomDto {
  name: string;
  creator: boolean;
  players: string[];
  maxPlayers: number;
  canIn: boolean;
}

export interface LobbyPlayerDto {
  nickname: string;
  sex: Sex;
  ready: boolean;
  you: boolean;
}

export interface LobbyRoomDto {
  name: string;
  creator: boolean;
  players: LobbyPlayerDto[];
  maxPlayers: number;
}

export type StatusPlayerDto = ClientPosition;

