import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuxService } from '../../../services/aux-service.service';
import { MeseroService } from '../../../services/mesero.service';
import { SharedModule } from '../../shared/shared.module';
import { ClientesService } from '../../../services/clientes.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DetalleFacturasService } from '../../../services/detalle-facturas.service';

@Component({
  selector: 'app-consumo-clientes',
  templateUrl: './consumo-clientes.component.html',
  styleUrls: ['./consumo-clientes.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    SharedModule,
    NzInputModule,
    NzIconModule,
    
  ],
})
export class ConsumoClientesComponent implements OnInit {
  displayedColumns: string[] = [
    'nombres',
    'apellidos', 
    'direccion', 
    'telefono', 
    'totalConsumo', 

  ];

  // Nombres amigables de las columnas
  columnNames = {
    nombres: 'Nombres',
    apellidos: 'Apellidos',
    direccion: 'Direccion',
    telefono: 'Telefono',
    totalConsumo: 'Total Consumo',
  };

  dates: any = {};
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];
  id: string | null = null;
  
  constructor(
    private readonly Service: ClientesService,
    private readonly auxService: AuxService,
  ) {
    
  }

  ngOnInit(): void {
    this.GetConsumoCliente();
    
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.GetConsumoCliente();
    // Aquí puedes manejar las fechas seleccionadas
  }

  GetConsumoCliente() {
    this.auxService.ventanaCargando();
    this.Service.get(`cliente-consumo`).subscribe({
      next: (data: any) => {
        this.dataSource = data;
        this.originalDataSource = data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error al cargar los datos:', error);
      },
    });
  }

  
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
  console.log('filterValue', filterValue);
    // Comprobar si el filtro es un número válido
    const filterNumber = parseFloat(filterValue);
  
    if (!filterValue || isNaN(filterNumber)) {
      // Si no hay filtro o no es un número válido, restaura los datos originales
      this.dataSource = [...this.originalDataSource];
    } else {
      // Si es un número válido, filtra solo por la propiedad 'totalConsumo'
      this.dataSource = this.originalDataSource.filter((item) => {
        // Asegurarse de que la propiedad 'totalConsumo' exista y sea un número
        const totalConsumo = item.totalConsumo;
        return totalConsumo !== undefined && !isNaN(totalConsumo) && totalConsumo >= filterNumber;
      });
    }
  }
}
