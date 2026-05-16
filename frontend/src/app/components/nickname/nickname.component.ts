import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WebsocketService } from '../../services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nickname',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './nickname.component.html',
  styleUrl: './nickname.component.scss'
})
export class NicknameComponent {
  control = new FormControl('', [Validators.required,]);
  constructor(private webs: WebsocketService, private router: Router) { }
  ngOnInit() {
    const n = localStorage.getItem("nickname");
    if (n) this.control.setValue(n);
    
    this.webs.disconnect()
  }
  answer: string | boolean | undefined = "Этот ник уже используется";
  click() {
    // this.webs.on("statusName", (d: any) => { this.changeAnswer(d) });
    const name = this.control.value as string;
    this.webs.checkNickname(name).subscribe(el => {
      if (el === true) {
        
        localStorage.setItem("nickname", name);
        this.webs.connect(name)
        this.router.navigate(["home"])
      }
      else {
        console.log(el);
        this.control.setErrors({"incorrect": true})
      }
    },
    (err) => {console.log(err);
    })
    // this.webs.emit("setName", this.control.value);
  }
  // changeAnswer(d: any) {
  //   if (d === "home"){
  //     localStorage.setItem("nickname", this.control.value as string)
  //     this.router.navigate(["home"])
  //   }
  //   else if (typeof d === "string") {
  //     this.answer = d;
  //     this.control.setErrors({"incorrect": true})
  //   }
  // }
}
