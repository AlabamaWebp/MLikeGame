import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import io, { Socket } from 'socket.io-client';
import type { ClientPosition, ClientSocketEventName, ClientSocketPayloads, ServerSocketEventName, ServerSocketPayloads } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket | undefined;
  private events = new Set<string>();
  readonly url = "http://localhost" // "http://192.168.172.189"

  constructor(private http: HttpClient, private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.unsubscribe();
      }
    })
  }
  isConnect() {
    return !!this.socket;
  }
  connect(name: string | undefined = undefined) {
    if (name == undefined) {
      const tmp = localStorage.getItem("nickname")
      if (!tmp || tmp.length == 0) 
        return
      else name = tmp;
    }
    this.socket = io(this.url + ':3001', {
      extraHeaders: { "name": new TextEncoder().encode(name).toString() }
    });
    this.socket.on("disconnect", () => {
      this.router.navigate(["start"])
    })
    this.socket.on('goTo', (str: ClientPosition) => {
      this.router.navigate([str])
    })
  }
  disconnect() {
    this.events.clear();
    this.socket?.close();
  }
  on<EventName extends ClientSocketEventName>(
    eventName: EventName,
    callback: (payload: ClientSocketPayloads[EventName]) => void
  ) {
    this.isConnect() ? 0 : this.connect();
    if (!this.isConnect())
      return
    if (!this.events.has(eventName)) {
      this.events.add(eventName);
      this.socket?.on(eventName, callback as never);
    }
  }
  off(ev: readonly ClientSocketEventName[]) {
    ev.forEach(e => this.events.delete(e))
  }
  emit<EventName extends ServerSocketEventName>(
    eventName: EventName,
    ...args: ServerSocketPayloads[EventName] extends void ? [] : [data: ServerSocketPayloads[EventName]]
  ) {
    this.isConnect() ? 0 : this.connect();
    if (!this.isConnect())
      return
    this.socket?.emit(eventName, args[0]);
  }
  unsubscribe() {
    this.events.forEach((el: string) => {
      this.socket?.off(el)
    })
  }

  checkNickname(nickname: string) {
    return this.http.post<boolean>(this.url + ":3000/nickname", { nickname: nickname });
  }
}
