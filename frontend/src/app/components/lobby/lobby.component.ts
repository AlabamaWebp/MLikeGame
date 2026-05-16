import { Component } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { NavigationStart, Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [MatButtonToggleModule, MatButtonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {
  constructor(private webs: WebsocketService, private router: Router) {
    !webs.isConnect() ? router.navigate(["start"]) : 0;
  }
  ngOnInit() {
    this.webs.on("statusLobby", (e: any) => {
      this.data = e;
    })
    this.webs.on("allReady", () => {
      this.router.navigate(["game"])
    })
    this.webs.emit("statusLobby");
  }
  data: data | undefined;
  clickReady(d: boolean) {
    this.webs.emit("setReady", d);
  }
  clickSex(d: string) {
    this.webs.emit("setSex", d);
  }
  roomOut() {
    this.webs.emit("roomOut");
    this.router.navigate(["home"]);
  }
  ngOnDestroy() {
    const events = [
      "statusLobby",
      "allReady"
    ]
    this.webs.off(events)
  }
}
interface data {
  name: string,
  creator: boolean,
  players: player[],
  maxPlayers: number,
}
interface player {
  nickname: string,
  sex: "Мужчина" | "Женщина",
  ready: boolean,
  you: boolean
}