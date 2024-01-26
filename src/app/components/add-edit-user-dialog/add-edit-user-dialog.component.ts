import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { OfflineDataService } from '../../services/offline-data.service';
import { OfflineCheckComponent } from '../offline-check/offline-check.component';
import { User } from 'src/app/models/user.model';
import { map, tap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add-edit-user-dialog',
  templateUrl: './add-edit-user-dialog.component.html',
  styleUrls: ['./add-edit-user-dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    JsonPipe,
    OfflineCheckComponent,
    MatSnackBarModule,
    NgIf
  ]
})
export class AddEditUserDialogComponent implements OnInit {

  addUserForm: FormGroup = new FormGroup({});
  offlineUsers: Array<User> = [];

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditUserDialogComponent>,
    private offlineDataService: OfflineDataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private firebase: FirebaseService
    ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.addUserForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [Validators.required]),
      status: new FormControl(!navigator.onLine),
    });
  }

  onSaveUser() {
    if (this.addUserForm.valid) {
      if (navigator.onLine) {
        if (this.data.userCount >= 10) {
          this.saveToLocalHost();
        } else {
          this.firebase.addUser(this.addUserForm.value);
        }
      } else {
        this.saveToLocalHost();
      }
      this.snackBar.open('User has been added!', 'X', {
        duration: 1000
      });
      this.dialogRef.close();
    }
  }

  saveToLocalHost() {
    const currentOfflineUsers = this.offlineDataService.getData();
    this.offlineUsers = [...currentOfflineUsers,  ...[this.addUserForm.value]];
    this.offlineUsers.map((user: User) => user.status = false);
    this.offlineDataService.saveData(this.offlineUsers);
  }

  latestNetworkStatus(isOnline: boolean) {
    this.addUserForm.get('status')?.setValue(isOnline);
  }
}
