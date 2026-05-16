import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    router: Router,
    // private webs: WebsocketService
  ) {
    // if (!location.pathname.includes("create")) 
    //   router.navigate(["start"])
    // router.navigate(["create"])
  }
}
