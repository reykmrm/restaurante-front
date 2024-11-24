import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SharedModule } from '../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { AuxService } from '../../services/aux-service.service';
import { VentasService } from '../../services/ventas.service';
import { CreateVentasComponent } from './create-ventas/create-ventas.component';
import { Router } from '@angular/router';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
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
export class VentasComponent implements OnInit {
  displayedColumns: string[] = [
    'fecha',
    'cliente',  // Cambié de 'referenciaFactura' a 'numeroFactura' según tu modelo
    'mesa',
    'mesero',
    'total',
];

// Nombres amigables de las columnas
columnNames = {
    fecha: 'Fecha',
    cliente: 'Cliente',  // Ajustado a tu modelo
    mesa: 'Mesa',
    mesero: 'Mesero',
    total: 'Total',
};


  dates: any = {};
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(

    private Service: VentasService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual

    this.dates = {
      FechaInicio: `${currentYear}-01-01`, // Establece la fecha de inicio al 1 de enero del año actual
      FechaFin: `${currentYear}-12-31`     // Establece la fecha de fin al 31 de diciembre del año actual
    };
  }
  
  ngOnInit(): void {
    this.GetVentas();
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.GetVentas(); 
    // Aquí puedes manejar las fechas seleccionadas
  }

  GetVentas() {
    this.auxService.ventanaCargando();
    this.Service.post('get-ventas',this.dates).subscribe({
      next: (data: any) => {
        console.log('data: ', data);
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

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(CreateVentasComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetVentas();
      }
    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateVentasComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetVentas();
      }
    });
  }

  onVer(event: any) {
    this.router.navigate(['/detalle-factura', event.nroFactura]); 
  }

  // Función para eliminar un usuario
  onDeleteAction(event: any) {
    this.auxService.ventanaCargando();
    this.Service.Delete('delete-wallet', event.idUsuario).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Registro eliminado correctamente',
            ''
          );
          this.GetVentas();
        } else {
          this.auxService.AlertWarning(
            'Error al eliminar el registro',
            data.message
          );
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al eliminar el registro', error.message);
      },
    });
  }

}
