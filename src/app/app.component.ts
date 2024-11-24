import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatSlideToggleModule,
    CommonModule,
    NzIconModule,
    MatIcon,
    MatToolbar,
    MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', [animate(300)]),
    ]),
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(-100%)' })),
      transition('in <=> out', [animate(300)])
    ]),
  ]
})
export class AppComponent implements OnInit {
  selectedKey: string = '';  // Al principio no hay ruta seleccionada
  isSidenavOpen: boolean = false;  // Control del estado del sidenav (abierto o cerrado)

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Si necesitas hacer alguna inicialización, la puedes hacer aquí
  }

  onMenuClick(event: any): void {
    this.selectedKey = event.key;  // Actualiza la ruta seleccionada en el menú
    this.router.navigate([event.key]);  // Navega a la ruta correspondiente
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;  // Cambia el estado del sidenav
  }
}
