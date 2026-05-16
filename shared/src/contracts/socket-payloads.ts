import type { ClientPosition } from "../game/statuses";
import type { CreateRoomDto, HomeRoomDto, LobbyRoomDto, StatusPlayerDto } from "./lobby";
import type { HelpAskDto, MunchkinOutputDto, UseCardPlaceDto } from "./munchkin";

export interface ClientSocketPayloads {
  allLog: string[];
  allReady: void;
  condition: string;
  goTo: ClientPosition;
  plusLog: string;
  refreshGame: MunchkinOutputDto | false;
  refreshRooms: HomeRoomDto[];
  statusCreate: string;
  statusDelete: string;
  statusLobby: LobbyRoomDto;
  statusPlayer: StatusPlayerDto;
  statusRoomIn: true | string;
}

export interface ServerSocketPayloads {
  allLog: void;
  createLobby: CreateRoomDto;
  deleteLobby: string;
  endHod: void;
  getDoorCardByPlayer: void;
  getLobbys: void;
  helpAnswer: boolean;
  helpAsk: HelpAskDto;
  pas: void;
  refreshGame: void;
  roomIn: string;
  roomOut: void;
  sbrosCard: number;
  sbrosEquip: number;
  sellCard: number;
  setReady: boolean;
  setSex: string;
  smivka: void;
  statusLobby: void;
  statusPlayer: void;
  toHome: void;
  useCard: number;
  useCardMesto: UseCardPlaceDto;
}

export type ClientSocketEventName = keyof ClientSocketPayloads;
export type ServerSocketEventName = keyof ServerSocketPayloads;

