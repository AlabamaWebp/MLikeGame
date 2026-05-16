import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { ClientSocketEventName, CreateRoomDto, HomeRoomDto, StatusPlayerDto } from '@shared';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatButtonToggleModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  nickname: string = localStorage.getItem("nickname") as string;
  rooms: HomeRoomDto[] = []
  creating = false;

  constructor(private webs: WebsocketService, private router: Router) {
    !webs.isConnect() ? router.navigate(["start"]) : 0;
  }

  ngOnInit() {
    this.webs.on("statusPlayer", (position: StatusPlayerDto) => {
      if (position === "lobby") this.router.navigate(["lobby"])
      else if (position === "game") this.router.navigate(["game"])
    });
    this.webs.on("refreshRooms", (rooms) => { this.rooms = rooms; });
    this.webs.on("statusCreate", (message) => { alert(message) });
    this.webs.on("statusDelete", (message) => { alert(message) });
    this.webs.on("statusRoomIn", (status) => { status === true ? this.router.navigate(["lobby"]) : alert(status); });
    this.webs.emit("statusPlayer")
    this.webs.emit("getLobbys");
  }

  changeNickname() {
    this.router.navigate(["start"])
  }

  create(max: number) {
    const room: CreateRoomDto = {
      name: "Комната " + this.nickname,
      max: Number(max)
    }
    this.webs.emit("createLobby", room);
    this.creating = false;
  }

  deleteR(name: string) {
    this.webs.emit("deleteLobby", name);
  }

  roomIn(name: string) {
    this.webs.emit("roomIn", name)
  }

  ngOnDestroy() {
    const events: ClientSocketEventName[] = [
      "refreshRooms",
      "statusCreate",
      "statusDelete",
      "statusRoomIn",
      "statusPlayer"
    ]
    this.webs.off(events)
  }
}
