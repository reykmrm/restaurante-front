import { Component, OnInit } from '@angular/core';
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
import { SharedModule } from '../../shared/shared.module';
import { MeseroService } from '../../../services/mesero.service';

@Component({
  selector: 'app-total-vendido-mesero',
  templateUrl: './total-vendido-mesero.component.html',
  styleUrls: ['./total-vendido-mesero.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTableModule,
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
export class TotalVendidoMeseroComponent implements OnInit {
  displayedColumns: string[] = [
    'nombres',
    'apellidos', // Cambié de 'referenciaFactura' a 'numeroFactura' según tu modelo
    'totalVentas',
  ];

  // Nombres amigables de las columnas
  columnNames = {
    nombres: 'Nombres',
    apellidos: 'Apellidos',
    totalVentas: 'Total de Ventas',
  };

  dates: any = {};
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];
  id: string | null = null;

  constructor(
    private Service: MeseroService,
    private auxService: AuxService,
    private route: ActivatedRoute
  ) {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual

    this.dates = {
      FechaInicio: `${currentYear}-01-01`, // Establece la fecha de inicio al 1 de enero del año actual
      FechaFin: `${currentYear}-12-31`, // Establece la fecha de fin al 31 de diciembre del año actual
    };
  }

  ngOnInit(): void {
    this.GetVentasMesero();
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.GetVentasMesero();
    // Aquí puedes manejar las fechas seleccionadas
  }

  GetVentasMesero() {
    this.auxService.ventanaCargando();
    this.Service.get(`ventas-mesero`).subscribe({
      next: (data: any) => {
        this.dataSource = data.data;
        this.originalDataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error al cargar los datos:', error);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!filterValue) {
      // Si no hay filtro, restaura los datos originales
      this.dataSource = [...this.originalDataSource];
    } else {
      this.dataSource = this.originalDataSource.filter((item) => {
        return this.displayedColumns.some((column) => {
          const columnValue = item[column];
          return (
            columnValue &&
            columnValue.toString().toLowerCase().includes(filterValue)
          );
        });
      });
    }
  }
}
