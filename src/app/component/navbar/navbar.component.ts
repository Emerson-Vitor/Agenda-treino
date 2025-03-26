import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;
  @Output() modeChange = new EventEmitter<string>();

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  changeMode(mode: string) {
    this.modeChange.emit(mode);
    this.menuOpen = false;
  }
}
