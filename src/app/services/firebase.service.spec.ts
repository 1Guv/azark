import { TestBed } from '@angular/core/testing';
import { FirebaseService } from './firebase.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { map, of } from 'rxjs';

describe('FirebaseService', () => {
  let service: FirebaseService;
  let mockAngularFirestore: jasmine.SpyObj<AngularFirestore>;
  let mockUserCollection: jasmine.SpyObj<AngularFirestoreCollection<User>>;

  beforeEach(() => {
    mockUserCollection = jasmine.createSpyObj('AngularFirestoreCollection', ['snapshotChanges']);
    mockAngularFirestore = jasmine.createSpyObj('AngularFirestore', ['collection']);
    mockAngularFirestore.collection.and.returnValue(mockUserCollection);

    TestBed.configureTestingModule({
      providers: [
        FirebaseService,
        { provide: AngularFirestore, useValue: mockAngularFirestore },
      ],
    });
    service = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
