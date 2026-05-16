import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import type { CardDto, CardTargetDto, DoorCardDto, TreasureCardDto } from '@shared';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatButton, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() data: AbstractCard | undefined = undefined;
  @Input() treasure = false;
  @Input() can_sbros = false;
  @Input() can_sell = false;
  @Input() main = false;

  @Output() use_mesto = new EventEmitter<toPlayer>();
  @Output() use_card = new EventEmitter<number>();
  @Output() sbros = new EventEmitter<number>();

  is_mesto = false;
  tCard: TreasureCard | undefined;
  dCard: DoorCard | undefined;
  podrobnee = false;

  constructor(private webs: WebsocketService) { }

  ngOnInit() {
    if (this.data?.abstractData.cardType == "Сокровище") {
      this.treasure = true;
      this.tCard = this.data as TreasureCard;
      return;
    }

    if (!this.data) return;

    const cardType = this.data.abstractData.cardType;
    this.is_mesto = isDoorCard(this.data) && !this.data.is_super && isCardTargetType(cardType);
    this.dCard = this.data as DoorCard;
  }

  useCard() {
    if (!this.data) return;

    if (this.is_mesto && !this.treasure) {
      const cardType = this.data.abstractData.cardType;
      if (!isCardTargetType(cardType)) return;

      this.use_mesto.emit({
        id: this.data.id,
        type: cardType,
      });
      setTimeout(() => {
        this.podrobnee = false;
      }, 1);
      return;
    }

    this.use_card.emit(this.data.id)
  }

  sbrosCard() {
    if (this.data) this.sbros.emit(this.data.id);
  }

  sellCard() {
    if (this.data) this.webs.emit("sellCard", this.data.id);
  }

  closeBackdrop(ev: MouseEvent) {
    const el = ev.target as HTMLElement;
    if (el.className.includes('backdrop')) {
      this.podrobnee = false
    }
  }
}

export type toPlayer = CardTargetDto;
export type TreasureCard = TreasureCardDto;
export type DoorCard = DoorCardDto;
export type AbstractCard = CardDto;

function isCardTargetType(cardType: string): cardType is CardTargetDto["type"] {
  return cardType === "Класс" || cardType === "Раса";
}

function isDoorCard(card: AbstractCard): card is DoorCard {
  return card.abstractData.cardType !== "Сокровище";
}
