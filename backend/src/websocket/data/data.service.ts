import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PlayerGlobal } from '../../data/main';

@Injectable()
export class DataService {
    clients: PlayerGlobal[] = [];

    getPl() {
        return this.clients.map(el => {
            return {
                name: el.name,
                position: el.position,
                id: el.socket.id
            }
        })
    }

    connectClient(client: Socket) {
        let name: string = client.handshake.headers['name'] as string;
        if (!name) return;
        name = new TextDecoder().decode(new Uint8Array(name.split(",").map(el => Number(el))))
        const existingClient = this.clients.find(el => el.name == name)
        if (existingClient) {
            existingClient.socket = client;
            client.emit("goTo", existingClient.getPositionStr())
        }
        else this.clients.push(new PlayerGlobal(client, name));
    }

    disconnectClient(client: Socket) {
        const player = this.getClient(client);
        if (player) {
            const isGameDisconnect = player.out();
            if (isGameDisconnect) return
            this.clients = this.clients.filter(el => el.socket != client);
        }
    }

    getClient(id: Socket): PlayerGlobal {
        return this.clients.find(el => el.socket == id);
    }

    getHomeClients() {
        return this.clients.filter(el => el.position == "home");
    }

    sendMessageToClient(client: Socket, message: unknown, head: string = "message") {
        if (client) {
            client.emit(head, message);
        }
    }
}
