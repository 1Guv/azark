import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  userCollection: AngularFirestoreCollection<any> = this.afs.collection<Array<User>>('users');

  constructor(
    private afs: AngularFirestore
  ) { }

  getAllUsers(): Observable<any> {
    return this.userCollection.snapshotChanges().pipe(
      // tap((users: any) => console.log('users', users)),
      map((users: any) =>
        users.map((user: any) => 
          ({
            ...user.payload.doc.data(),
            id: user.payload.doc.id
          })
        )
      )
    );
  }

  addUser(user: User) {
    user.status = true;
    this.afs.collection<any>('users').add(user);
  }

  deleteUser(user: User) {
    this.afs.collection<Array<User>>('users').doc(user.id).delete();
  }
}
