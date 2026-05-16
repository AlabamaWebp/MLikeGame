import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-nickname',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './nickname.component.html',
  styleUrl: './nickname.component.scss'
})
export class NicknameComponent {
  control = new FormControl('', [Validators.required]);
  answer: string | boolean | undefined = "Этот ник уже используется";

  constructor(private webs: WebsocketService, private router: Router) { }

  ngOnInit() {
    const nickname = localStorage.getItem("nickname");
    if (nickname) this.control.setValue(nickname);
    this.webs.disconnect()
  }

  click() {
    const name = this.control.value as string;
    this.webs.checkNickname(name).subscribe({
      next: (isAvailable) => {
        if (isAvailable) {
          localStorage.setItem("nickname", name);
          this.webs.connect(name)
          this.router.navigate(["home"])
          return;
        }

        this.control.setErrors({ "incorrect": true })
      },
      error: () => this.control.setErrors({ "incorrect": true })
    })
  }
}
