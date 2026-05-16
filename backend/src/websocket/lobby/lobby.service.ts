import { Injectable } from '@nestjs/common';
import type { HomeRoomDto } from '@shared';
import { Socket } from "socket.io"
import { Lobby, PlayerGlobal } from '../../data/main';
import { DataService } from '../data/data.service';

@Injectable()
export class LobbyService {
    private lobbys: Map<string, Lobby> = new Map();

    constructor(private data: DataService,) { }

    getLobbys(player: PlayerGlobal): HomeRoomDto[] {
        const rooms: HomeRoomDto[] = [];
        this.lobbys.forEach((value: Lobby) => {
            rooms.push(value.homeGetRoom(player));
        })
        return rooms;
    }

    getOneLobby(name: string) {
        return this.lobbys.get(name);
    }

    createLobby(name: string, max: number, socket: Socket, nickname: string) {
        if (this.lobbys.get(name)) {
            return "Комната созданная вами уже есть";
        }
        this.lobbys.set(name, new Lobby(name, max, socket, nickname));
        return true;
    }

    deleteLobby(name: string, client: Socket) {
        const lobby = this.getOneLobby(name);
        const player = this.data.getClient(client)
        if (lobby) {
            if (lobby.getPlayersLenght().count) {
                return "В комнате есть игроки"
            }
            if (player.name !== lobby.creator.name) {
                return "Вы не создатель комнаты"
            }
            this.lobbys.delete(name);
            return true;
        }
        else return "Нет такоР№ комнаты"
    }

    refreshOneLobby(roomName: string,) {
        const lobby = this.getOneLobby(roomName);
        lobby?.getLobbySocket().forEach(socket => {
            socket?.emit("statusLobby", lobby.lobbyGetRoom(this.data.getClient(socket)))
        })
    }

    lobbyGameStart(roomName: string,) {
        const lobby = this.getOneLobby(roomName);
        lobby?.getLobbySocket().forEach(socket => socket?.emit("allReady"))
        this.lobbys.delete(roomName);
    }

    roomIn(socket: Socket, roomName: string) {
        const client = this.data.getClient(socket);
        const lobby = this.getOneLobby(roomName);
        if (!lobby || !client)
            return "Что-то не так"
        else if (client.position !== "home")
            return "ОС€ибка позиции"
        return lobby.in(client);
    }
}
