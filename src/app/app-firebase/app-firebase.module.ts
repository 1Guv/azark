import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

export const firebase = {
  apiKey: 'AIzaSyAFHrIalYT2YEpCWIxfs8910a65GWZiiws',
  authDomain: 'test-9feb6.firebaseapp.com',
  projectId: 'test-9feb6',
  storageBucket: 'test-9feb6.appspot.com',
  messagingSenderId: '472568761900',
  appId: '1:472568761900:web:3a05114cafefe62c9c8b89',
  measurementId: 'G-VDDC8CKC12',
};

@NgModule({
  imports: [AngularFireModule.initializeApp(firebase), AngularFirestoreModule],
  exports: [AngularFirestoreModule],
})

export class AppFirebaseModule {}
