import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Router } from '@angular/router';
import { CardComponent, toPlayer } from './card/card.component';
import { PlayerComponent } from './player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { HelpFightComponent } from './dialogs/help-fight/help-fight.component';
import { animate, style, transition, trigger } from '@angular/animations';
import type { MunchkinOutputDto, PlayerStatsDto } from '@shared';
// import { MatIconModule } from '@angular/material/icon';

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
  constructor(private webs: WebsocketService, private router: Router, private detector: ChangeDetectorRef) {
    !webs.isConnect() ? router.navigate(["start"]) : 0;
  }
  ngOnDestroy() {
    const ev = [
      "refreshGame",
      "condition",
      "allLog",
      "plusLog",
    ]
    this.webs.off(ev)
  }
  ngOnInit() {
    this.webs.on("refreshGame", (el: any) => {
      this.data = el;
      this.step = el.you_hodish ? el.step : -1;
      console.log(el);
      if (el.help_ask) this.openHelpDialog();
      this.you = undefined;
      setTimeout(() => {
        this.you = this.data?.you;
      }, 1);
    })

    this.webs.on("condition", (el: any) => {
      clearTimeout(this.cond_timer);
      this.condition = el;
      this.cond_timer = setTimeout(() => { this.condition = undefined }, 5000);
    })

    this.webs.on("allLog", (el: any) => { this.log_ = el; })
    this.webs.on("plusLog", (el: any) => { this.log_.unshift(el); })

    this.webs.emit("refreshGame");
    this.webs.emit("allLog");
    // firstStepHod
  }
  getDoorCard() { this.webs.emit("getDoorCardByPlayer") }
  endHod() { this.webs.emit("endHod") }
  end() { this.webs.emit("toHome") }
  setPas() { this.webs.emit("pas") }
  smivka() { this.webs.emit('smivka') }
  sbros(id: number) { this.webs.emit("sbrosCard", id) }
  cond_timer: any;
  show_stats = true;
  condition: string | undefined;
  data: MunchkinOutputDto | undefined;
  you: any;
  log_: string[] = [];
  step: number = -1;

  dataMesto: toPlayer | undefined;

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


  readonly dialog = inject(MatDialog);
  openHelpDialog(): void {
    const dialogRef = this.dialog.open(HelpFightComponent, { data: this.data?.help_ask?.gold, });
    dialogRef.afterClosed().subscribe(result => { 
      if (result !== undefined && this.data?.help_ask)
       this.webs.emit('helpAnswer', result) });
  }
}

export type playerData = PlayerStatsDto;
