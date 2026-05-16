import { Component, inject } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import type { ClientSocketEventName, MunchkinOutputDto, PlayerStatsDto } from '@shared';
import { WebsocketService } from '../../services/websocket.service';
import { CardComponent, toPlayer } from './card/card.component';
import { HelpFightComponent } from './dialogs/help-fight/help-fight.component';
import { PlayerComponent } from './player/player.component';

@Component({
  selector: 'app-munchkin',
  standalone: true,
  imports: [CardComponent, PlayerComponent, MatFormFieldModule, FormsModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './munchkin.component.html',
  styleUrl: './munchkin.component.scss',
  animations: [
    trigger("height", [
      transition(":enter", [style({ height: 0, opacity: 0 }), animate(300, style({ height: '*', opacity: 1 }))])
    ]),
  ]
})
export class MunchkinComponent {
  cond_timer: ReturnType<typeof setTimeout> | undefined;
  show_stats = true;
  condition: string | undefined;
  data: MunchkinOutputDto | undefined;
  you!: PlayerStatsDto;
  log_: string[] = [];
  step: number = -1;
  dataMesto: toPlayer | undefined;

  readonly dialog = inject(MatDialog);

  constructor(private webs: WebsocketService, private router: Router) {
    !webs.isConnect() ? router.navigate(["start"]) : 0;
  }

  ngOnInit() {
    this.webs.on("refreshGame", (gameState) => {
      if (!gameState) {
        this.data = undefined;
        return;
      }

      this.data = gameState;
      this.step = gameState.you_hodish ? gameState.step : -1;
      if (gameState.help_ask) this.openHelpDialog();
      setTimeout(() => {
        this.you = gameState.you;
      }, 1);
    })

    this.webs.on("condition", (message) => {
      clearTimeout(this.cond_timer);
      this.condition = message;
      this.cond_timer = setTimeout(() => { this.condition = undefined }, 5000);
    })

    this.webs.on("allLog", (log) => { this.log_ = log; })
    this.webs.on("plusLog", (logMessage) => { this.log_.unshift(logMessage); })

    this.webs.emit("refreshGame");
    this.webs.emit("allLog");
  }

  ngOnDestroy() {
    const events: ClientSocketEventName[] = [
      "refreshGame",
      "condition",
      "allLog",
      "plusLog",
    ]
    this.webs.off(events)
  }

  getDoorCard() { this.webs.emit("getDoorCardByPlayer") }
  endHod() { this.webs.emit("endHod") }
  end() { this.webs.emit("toHome") }
  setPas() { this.webs.emit("pas") }
  smivka() { this.webs.emit('smivka') }
  sbros(id: number) { this.webs.emit("sbrosCard", id) }

  useCard(id: number) {
    this.webs.emit("useCard", id);
  }

  useCardMesto(body: toPlayer) {
    const card = this.data?.you.cards.find(e => e.id == body.id)
    if ((card?.abstractData.cardType == "Класс" && this.data?.classes_mesto)
      || (card?.abstractData.cardType == "Раса" && this.data?.rasses_mesto)
    ) this.dataMesto = body;
    else this.useCard(body.id)
  }

  closeYou() { this.dataMesto = undefined; }
  canEnd() { return !((this.step == 3) && ((this.data?.you.max_cards ?? 0) >= (this.data?.you.cards.length ?? 0))) }
  statsToggle(ev: boolean) {
    this.show_stats = ev;
  }

  openHelpDialog(): void {
    const dialogRef = this.dialog.open(HelpFightComponent, { data: this.data?.help_ask?.gold });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && this.data?.help_ask)
        this.webs.emit('helpAnswer', Boolean(result))
    });
  }
}

export type playerData = PlayerStatsDto;
