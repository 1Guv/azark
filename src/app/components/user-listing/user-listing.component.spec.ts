import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserListingComponent } from './user-listing.component';
import { OfflineCheckComponent } from '../offline-check/offline-check.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user.model';
import { OfflineDataService } from 'src/app/services/offline-data.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable, of } from 'rxjs';

describe('UserListingComponent', () => {
  let component: UserListingComponent;
  let fixture: ComponentFixture<UserListingComponent>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockOfflineDataService: jasmine.SpyObj<OfflineDataService>;
  let mockFirebaseService: jasmine.SpyObj<FirebaseService>;

  beforeEach(async () => {
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockOfflineDataService = jasmine.createSpyObj('OfflineDataService', ['getData', 'saveData', 'clearData']);
    mockFirebaseService = jasmine.createSpyObj('FirebaseService', {
      'getAllUsers': of([]), 
      'deleteUser': '',
      'addUser': ''
    });

    await TestBed.configureTestingModule({
      declarations: [ ],
      imports: [
        OfflineCheckComponent,
        UserListingComponent
      ],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: OfflineDataService, useValue: mockOfflineDataService },
        { provide: FirebaseService, useValue: mockFirebaseService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties on ngOnInit', () => {
    spyOn(component, 'getUsers');
    spyOn(component, 'checkUsersOnLocalStorage');
    spyOn(component, 'latestNetworkStatus');
    spyOn(component, 'getUserCount');

    component.ngOnInit();

    expect(component.isOnline).toBe(true);
    expect(component.getUsers).toHaveBeenCalled();
    expect(component.checkUsersOnLocalStorage).toHaveBeenCalled();
    expect(component.latestNetworkStatus).toHaveBeenCalledWith(true);
    expect(component.getUserCount).toHaveBeenCalled();
  });

  it('should get users from Firebase on getUsers', () => {
    const mockUsers: User[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', phone: 12345, email: 'john@does.com', status: true}, 
      { id: '2', firstName: 'Jane', lastName: 'Doe', phone: 12345, email: 'john@does.com', status: true}
    ];
    mockFirebaseService.getAllUsers.and.returnValue(of(mockUsers));

    component.getUsers();

    expect(component.users$).toEqual(jasmine.any(Observable));
    component.users$.subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });
  });
});
