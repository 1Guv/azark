import { Component } from '@angular/core';
import { AppFirebaseModule } from '../../app-firebase/app-firebase.module';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { Observable, first, map } from 'rxjs';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEditUserDialogComponent } from '../add-edit-user-dialog/add-edit-user-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { OfflineDataService } from '../../services/offline-data.service';
import { OfflineCheckComponent } from '../offline-check/offline-check.component';
import { User } from 'src/app/models/user.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
  standalone: true,
  imports: [
    AppFirebaseModule, 
    NgFor, 
    AsyncPipe, 
    MatDialogModule, 
    MatButtonModule, 
    JsonPipe, 
    OfflineCheckComponent,
    NgIf,
    MatSnackBarModule
  ]
})
export class UserListingComponent {

  users$: Observable<any> = new Observable<any>;
  localStorageUsers: Array<User> = [];
  isOnline: boolean = true;
  userCount = 0;

  constructor(
    public dialog: MatDialog,
    private offlineDataService: OfflineDataService,
    private snackBar: MatSnackBar,
    private firebase: FirebaseService
    ) {}

  ngOnInit() {
    this.getUsers();
    this.checkUsersOnLocalStorage();
    this.latestNetworkStatus(this.isOnline);
    this.getUserCount();
  }

  getUsers() {
    this.users$ = this.firebase.getAllUsers();
  }

  deleteFirebaseUser(user: User) {
    this.firebase.deleteUser(user);
  }

  deleteLocalHostUser(userToRemove: User) {
    this.localStorageUsers = this.offlineDataService.getData();
    this.localStorageUsers.splice(this.localStorageUsers.indexOf(userToRemove), 1);
    this.offlineDataService.saveData(this.localStorageUsers);
  }

  deleteFirstLocalHostUser(user: User) {
    this.localStorageUsers = this.offlineDataService.getData();
    this.localStorageUsers.splice(0,1);
    this.offlineDataService.saveData(this.localStorageUsers);
  }

  addFirebaseUser(user: User) {
    this.firebase.addUser(user);
  }

  addLocalHostUser(user: User) {
    user.status = false;
    this.localStorageUsers = this.offlineDataService.getData();
    const allLocalStorageUsers = [...this.localStorageUsers, ...[user]];
    this.offlineDataService.saveData(allLocalStorageUsers);
  }

  getUserCount() {
    this.users$
      .pipe(
        first(),
        map((users: Array<User>) => {
          this.userCount = users.length;
        })
      )
      .subscribe();
  }

  openAddUserDialog() {
    this.users$.pipe(first()).subscribe((users: Array<User>) => {
      this.userCount = users.length;
      
      const addUserDialogRef = this.dialog.open(AddEditUserDialogComponent, {
        data: { userCount: this.userCount },
        width: '50vw',
        height: '60vh'
      });
      
      addUserDialogRef.afterClosed().subscribe((result: any) => {
        this.checkUsersOnLocalStorage();
        this.getUserCount();
      });
    });
  }

  onDelete(user: User) {
    this.deleteFirebaseUser(user);
    this.users$.pipe(first()).subscribe((users: Array<User>) => {
      this.userCount = users.length;

      if (this.userCount === 10) {
        this.addLocalHostUser(user);
        this.getUserCount();
      } else {
        this.deleteFirebaseUser(user);
        this.getUserCount();

        this.localStorageUsers = this.offlineDataService.getData();
        if (this.localStorageUsers.length > 0) {
          this.addFirebaseUser(this.localStorageUsers[0]);
          this.deleteFirstLocalHostUser(this.localStorageUsers[0]);
        }
      }

      this.snackBar.open('User has been deleted!', 'X', {
        duration: 1000
      });

    });
  }

  clearLocalStorage() {
    this.offlineDataService.clearData();
    this.checkUsersOnLocalStorage();
  }

  checkUsersOnLocalStorage() {
    this.localStorageUsers = this.offlineDataService.getData();
  }

  latestNetworkStatus(isOnline: boolean) {
    this.isOnline = isOnline;
    if (isOnline) {
      this.updateFirebase()
    }
  }

  updateFirebase() {
    this.checkUsersOnLocalStorage();

    this.users$.pipe(first()).subscribe((users: Array<User>) => {
      this.userCount = users.length;

      if (this.userCount < 10) {
        if (this.localStorageUsers.length > 0) {
          this.addFirebaseUser(this.localStorageUsers[0]);
          this.deleteFirstLocalHostUser(this.localStorageUsers[0]);
          this.updateFirebase();
        }
      }
    });
  }

  onDeleteLocalStorage(userToRemove: User) {
    this.localStorageUsers.splice(this.localStorageUsers.indexOf(userToRemove), 1);
    this.offlineDataService.saveData(this.localStorageUsers);
    this.snackBar.open('User has been deleted!', 'X', {
      duration: 1000
    });
  }

  isUserDataAvailable() {
    return this.localStorageUsers && this.localStorageUsers.length > 0 ? true : false;
  }

}
