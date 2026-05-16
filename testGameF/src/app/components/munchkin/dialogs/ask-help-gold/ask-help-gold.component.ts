import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-ask-help-gold',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonToggleModule,
  ],
  templateUrl: './ask-help-gold.component.html',
  styleUrl: './ask-help-gold.component.scss'
})
export class AskHelpGoldComponent {
  readonly dialogRef = inject(MatDialogRef<AskHelpGoldComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  mass: number[] = [];
  num = 0;
  ngOnInit() {
    for (let i = 0; i < this.data + 1; i++) this.mass[i] = i;
  }
  select(n: number) {
    this.num = n;
  }
  close1(ans?: any): void {
    this.dialogRef.close(ans ? this.num : undefined);
  }
}
