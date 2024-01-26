import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-offline-check',
  templateUrl: './offline-check.component.html',
  styleUrls: ['./offline-check.component.scss'],
  standalone: true,
  imports: [NgIf]
})
export class OfflineCheckComponent {
  @Output() latestStatus = new EventEmitter<boolean>();
  isOnline: boolean = true;

  ngOnInit() {
    this.checkOnlineStatus();

    // Add event listeners to track changes in online/offline status
    window.addEventListener('online', () => this.checkOnlineStatus());
    window.addEventListener('offline', () => this.checkOnlineStatus());
  }

  checkOnlineStatus() {
    this.isOnline = navigator.onLine;
    this.latestStatus.next(this.isOnline);
  }
}
