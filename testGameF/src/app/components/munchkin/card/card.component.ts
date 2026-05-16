import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { WebsocketService } from '../../../services/websocket.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatButton, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  animations: [
    // trigger("width", [
    //   transition(":leave", [animate(300, style({ width: 0, opacity: 0 }))])
    // ])
  ]
})
export class CardComponent {

  constructor(private webs: WebsocketService) { }
  @Input() data: AbstractCard | any = undefined
  @Input() treasure: boolean = false;
  @Input() can_sbros: boolean = false;
  @Input() can_sell: boolean = false;
  @Input() main: boolean = false;

  @Output() use_mesto = new EventEmitter<toPlayer>();
  @Output() use_card = new EventEmitter<number>();
  @Output() sbros = new EventEmitter<number>();

  useCard() {
    const id = this.data.id
    if (this.is_mesto && !this.treasure) {
      const tmp: toPlayer = {
        id: id,
        type: this.data.abstractData.cardType
      }
      this.use_mesto.emit(tmp);
      setTimeout(() => {
        this.podrobnee = false;
      }, 1);
    }
    else this.use_card.emit(id)
  }
  sbrosCard() { this.sbros.emit(this.data.id); }
  sellCard() { this.webs.emit("sellCard", this.data.id); }
  ngOnInit() {
    if (this.data?.abstractData.cardType == "Сокровище") {
      this.treasure = true;
      this.tCard = this.data;
    }
    else {
      if (
        !this.data?.is_super
        && (this.data?.abstractData.cardType == "Класс"
          || this.data?.abstractData.cardType == "Раса")
      )
        this.is_mesto = true;
      this.dCard = this.data;
    }
  }

  is_mesto = false;

  tCard: TreasureCard | undefined;
  dCard: DoorCard | undefined;

  podrobnee = false;

  closeBackdrop(ev: MouseEvent) {
    const el = ev.target as HTMLElement;
    if (el.className.includes('backdrop')) {
      this.podrobnee = false
    }
  }
  test(v: any) {
    console.log(v);
    return v
  }
}

export interface toPlayer {
  id: number,
  type: "Класс" | "Раса"
}
interface TreasureCard {
  abstractData: AbstractData,
  strongest: number,
  data: TreasureData,
  id: number
}
interface DoorCard {
  abstractData: AbstractData,
  data?: MonsterData,
  id: number
}

interface AbstractData {
  name: string;
  description: string;
  cardType: "Класс" | "Раса" | "Проклятие" | "Монстр" | "Сокровище"
  img?: string;
  cost: number
}
interface MonsterData {
  get_lvls: number;
  strongest: number;
  gold: number;
  undead?: boolean;
}
interface TreasureData {
  treasureType: "Надеваемая" | "Используемая" | "Боевая"
  template?: "Шлем" | "Броник" | "Ноги" | "Рука"
  | "2 Руки" | "3 Руки" | "Рядом" | undefined
  big?: boolean | undefined
}



export interface AbstractCard {
  abstractData: AbstractData;
  id: number;
  strong?: number;
  data?: TreasureData | MonsterData;
  is_super?: boolean
  use: boolean
}


// tCard: TreasureCard = {
//   abstractData: {
//     name: "Коротышные латы",
//     description: "Только для дварфов",
//     cardType: "Сокровище"
//   },
//   data: {
//     treasureType: "Надеваемая",
//     template: "Рядом",
//     cost: 1200,
//     // big: true
//   },
//   strongest: 2
// }

// dCard: DoorCard = {
//   abstractData: {
//     name: "3872 орка",
//     description: "+6 против дварфов (старые счёты)",
//     cardType: "Монстр"
//   },
//   data: {
//     lvl: 10,
//     gold: 3,
//     strongest: 10,
//     undead: false,
//   },
// }