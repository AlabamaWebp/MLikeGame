import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import io, { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
// getLobbys setName createLobby deleteLobby roomIn
// refreshRooms statusCreate statusDelete
export class WebsocketService {
  private socket: Socket | undefined;

  constructor(private http: HttpClient, private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.unsubscribe();
      }
    })
  }
  url = "http://localhost" // "http://192.168.172.189"
  isConnect() {
    return this.socket ? true : false;
  }
  connect(name: string | undefined = undefined) {
    if (name == undefined) {
      const tmp = localStorage.getItem("nickname")
      if (!tmp || tmp?.length == 0) 
        return
      else name = tmp;
    }
    this.socket = io(this.url + ':3001', {
      extraHeaders: { "name": new TextEncoder().encode(name).toString() }
    });
    this.socket.on("disconnect", (e) => {
      // console.log(e);
      this.router.navigate(["start"])
    })
    this.socket.on('goTo', (str: "home" | "game" | "lobby") => {
      this.router.navigate([str])
    })
  }
  disconnect() {
    this.events.clear();
    this.socket?.close();
  }
  events = new Set<string>();
  on(eventName: string, callback: any) {
    this.isConnect() ? 0 : this.connect();
    if (!this.isConnect())
      return
    if (!this.events.has(eventName)) {
      this.events.add(eventName);
      this.socket?.on(eventName, callback);
    }
  }
  off(ev: string[]) {
    ev.forEach(e => this.events.delete(e))
  }
  emit(eventName: string, data: any = undefined) {
    this.isConnect() ? 0 : this.connect();
    if (!this.isConnect())
      return
    this.socket?.emit(eventName, data);
  }
  unsubscribe() {
    this.events.forEach((el: string) => {
      this.socket?.off(el)
    })
    // this.events.clear();
  }

  checkNickname(nickname: string) {
    return this.http.post(this.url + ":3000/nickname", { nickname: nickname });
  }
}