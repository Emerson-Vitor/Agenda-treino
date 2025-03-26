// src/app/component/loading-spinner/loading-spinner.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GlobalStateService
} from '../../services/global-state-service/global-state.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  loadingVisible = false;

  constructor(private globalState: GlobalStateService) {}

  ngOnInit(): void {
    this.globalState.loadingVisible$.subscribe(visible => {
      this.loadingVisible = visible;
    });
  }
}
