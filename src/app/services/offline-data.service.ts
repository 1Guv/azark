import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OfflineDataService {

  private readonly localStorageKey = 'yourAppData';

  saveData(data: any): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  getData(): any {
    const storedData = localStorage.getItem(this.localStorageKey);
    return storedData ? JSON.parse(storedData) : [];
  }

  clearData(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
