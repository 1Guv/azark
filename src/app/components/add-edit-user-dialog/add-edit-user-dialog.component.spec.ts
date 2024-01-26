import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { AddEditUserDialogComponent } from './add-edit-user-dialog.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from 'src/app/services/firebase.service';
import { OfflineDataService } from 'src/app/services/offline-data.service';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AddEditUserDialogComponent', () => {
  let component: AddEditUserDialogComponent;
  let fixture: ComponentFixture<AddEditUserDialogComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<AddEditUserDialogComponent>>;
  let mockMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockOfflineDataService: jasmine.SpyObj<OfflineDataService>;
  let mockFirebaseService: jasmine.SpyObj<FirebaseService>;
  let mockFormBuilder: jasmine.SpyObj<FormBuilder>;

  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockOfflineDataService = jasmine.createSpyObj('OfflineDataService', ['getData', 'saveData']);
    mockFirebaseService = jasmine.createSpyObj('FirebaseService', ['addUser']);
    mockFormBuilder = jasmine.createSpyObj('FormBuilder', ['group']);

    await TestBed.configureTestingModule({
      declarations: [ ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: OfflineDataService, useValue: mockOfflineDataService },
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: FormBuilder, useValue: mockFormBuilder },
        provideAnimations()
      ],
      imports: [FormsModule, ReactiveFormsModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save user to local host when form is valid and offline', () => {
    spyOnProperty(navigator, 'onLine').and.returnValue(false);
    const saveToLocalHostSpy = spyOn(component, 'saveToLocalHost');
    component.buildForm();
    
    component.addUserForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      status: false,
    });
    component.onSaveUser();
    expect(saveToLocalHostSpy).toHaveBeenCalled();
  });
});

