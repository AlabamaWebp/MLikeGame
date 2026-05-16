import type { Sex } from "../game/statuses";

export interface AbstractCardDataDto {
  name: string;
  description: string;
  cardType: DoorCardType | "Сокровище";
  img?: string;
  cost?: number;
}

export interface MonsterDataDto {
  get_lvls: number;
  strongest: number;
  gold: number;
  undead?: boolean;
}

export interface TreasureDataDto {
  treasureType: "Надеваемая" | "Используемая" | "Боевая";
  template?: "Шлем" | "Броник" | "Ноги" | "Рука" | "2 Руки" | "3 Руки" | "Рядом";
  big?: boolean;
}

export type DoorCardType = "Класс" | "Раса" | "Проклятие" | "Монстр" | "МонстрБаф";

export interface TreasureCardDto {
  abstractData: AbstractCardDataDto;
  strongest?: number;
  strong?: number;
  data: TreasureDataDto;
  id: number;
  use: boolean;
}

export interface DoorCardDto {
  abstractData: AbstractCardDataDto;
  data?: MonsterDataDto;
  id: number;
  is_super?: boolean;
  use: boolean;
}

export type CardDto = TreasureCardDto | DoorCardDto;

export interface DoorFieldDto {
  first?: DoorCardDto;
  second?: DoorCardDto;
  bonus?: DoorCardDto;
}

export interface PlayerStatsDto {
  name: string;
  lvl: number;
  sex: Sex;
  cards?: CardDto[];
  t_field: {
    helmet: TreasureCardDto[];
    body: TreasureCardDto[];
    legs: TreasureCardDto[];
    arm: TreasureCardDto[];
    other: TreasureCardDto[];
  };
  d_field: {
    rasses: DoorFieldDto;
    classes: DoorFieldDto;
  };
  queue: number;
  max_cards: number;
  power: number;
  coins: number;
}

export type CurrentPlayerStatsDto = PlayerStatsDto & {
  cards: CardDto[];
};

export interface PlayerFightDto {
  player: PlayerStatsDto;
  gold?: number;
  smivka?: boolean;
}

export interface GameFieldDto {
  is_fight: boolean;
  fight?: {
    players: {
      main: PlayerFightDto;
      secondary?: PlayerFightDto;
      strongest?: number;
    };
    cards?: {
      players?: CardDto[];
      monsters?: CardDto[];
    };
    monsters?: DoorCardDto[];
    monsterStrongest?: number;
    gold?: number;
    lvls?: number;
  };
  openCards?: CardDto[];
}

export interface MunchkinOutputDto {
  queue: string;
  step: 0 | 1 | 2 | 3;
  field: GameFieldDto;
  is_fight: boolean;
  sbros: {
    doors?: DoorCardDto;
    treasures?: TreasureCardDto;
  };
  players: PlayerStatsDto[];
  you: CurrentPlayerStatsDto;
  you_hodish: boolean;
  pas: boolean;
  smivka: boolean;
  cards: {
    doors: number;
    treasures: number;
  };
  rasses_mesto: boolean;
  classes_mesto: boolean;
  help_ask?: {
    pl: PlayerStatsDto;
    gold: number;
  };
  is_help: boolean;
  end: boolean;
}

export interface CardTargetDto {
  id: number;
  type: "Класс" | "Раса";
}

export interface UseCardPlaceDto {
  id_card: number;
  mesto: "first" | "second" | "bonus";
}

export interface HelpAskDto {
  to: string;
  gold: number;
}
