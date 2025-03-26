// src/app/component/notification/notification.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GlobalStateService
} from '../../services/global-state-service/global-state.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notificationVisible = false;
  notificationText = '';
  notificationColor = '#000';

  constructor(private globalState: GlobalStateService) {}

  ngOnInit(): void {
    this.globalState.notificationVisible$.subscribe(visible => {
      this.notificationVisible = visible;
    });
    this.globalState.notificationText$.subscribe(text => {
      this.notificationText = text;
    });
    this.globalState.notificationColor$.subscribe(color => {
      this.notificationColor = color;
    });
  }
}
