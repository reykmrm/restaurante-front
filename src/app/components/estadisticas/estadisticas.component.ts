import { Component, OnInit } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ConsumoClientesComponent } from './consumo-clientes/consumo-clientes.component';
import { TotalVendidoMeseroComponent } from './total-vendido-mesero/total-vendido-mesero.component';
import { ReportesComponent } from './reportes/reportes.component';
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  standalone: true,
  imports: [NzTabsModule, TotalVendidoMeseroComponent, ConsumoClientesComponent, ReportesComponent],
})
export class EstadisticasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
