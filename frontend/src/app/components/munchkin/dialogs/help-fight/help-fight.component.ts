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
@Component({
  selector: 'app-help-fight',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './help-fight.component.html',
  styleUrl: './help-fight.component.scss'
})
export class HelpFightComponent {
  readonly dialogRef = inject(MatDialogRef<HelpFightComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);

  close1(ans?: boolean): void {
    this.dialogRef.close(ans);
  }
}
