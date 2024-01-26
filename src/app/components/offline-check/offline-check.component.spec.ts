import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OfflineCheckComponent } from './offline-check.component';

describe('OfflineCheckComponent', () => {
  let component: OfflineCheckComponent;
  let fixture: ComponentFixture<OfflineCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isOnline to true on ngOnInit', () => {
    component.ngOnInit();
    expect(component.isOnline).toBe(true);
  });

  it('should call checkOnlineStatus on ngOnInit', () => {
    spyOn(component, 'checkOnlineStatus');
    component.ngOnInit();
    expect(component.checkOnlineStatus).toHaveBeenCalled();
  });

  it('should add online and offline event listeners on ngOnInit', () => {
    spyOn(window, 'addEventListener');
    component.ngOnInit();
    expect(window.addEventListener).toHaveBeenCalledWith('online', jasmine.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('offline', jasmine.any(Function));
  });

  it('should update isOnline and emit latestStatus on online event', fakeAsync(() => {
    spyOn(component, 'checkOnlineStatus');
    const latestStatusEventEmitter = jasmine.createSpyObj('latestStatus', ['next']);
    component.latestStatus = latestStatusEventEmitter;
    component.latestStatus.next(true);

    component.ngOnInit();
    tick();

    window.dispatchEvent(new Event('online'));

    expect(component.checkOnlineStatus).toHaveBeenCalled();
    expect(component.isOnline).toBe(true);
    expect(component.latestStatus.next).toHaveBeenCalledWith(true);
  }));
});
