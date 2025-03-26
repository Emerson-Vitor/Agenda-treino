// src/app/services/global-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Alert} from '../../alert.enum';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  loadingVisible$ = new BehaviorSubject<boolean>(false);
  notificationVisible$ = new BehaviorSubject<boolean>(false);
  notificationText$ = new BehaviorSubject<string>('');
  notificationColor$ = new BehaviorSubject<string>('#000');

  showLoading(): void {
    this.loadingVisible$.next(true);
  }

  hideLoading(): void {
    this.loadingVisible$.next(false);
  }

  hideNotification(): void {
    this.notificationVisible$.next(false);
  }

  showNotification(alert: Alert, text: string): void {
    if (alert === Alert.Bad) {
      this.notificationColor$.next("#FF5733");
      this.notificationText$.next(text);
      this.notificationVisible$.next(true);
    } else if (alert === Alert.Success) {
      this.notificationColor$.next("#2e8b57");
      this.notificationText$.next(text);
      this.notificationVisible$.next(true);
    } else {
      this.notificationColor$.next("#FF5733");
      this.notificationText$.next("erro ao exibir alerta...");
      this.notificationVisible$.next(true);
      return;
    }
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }
}
