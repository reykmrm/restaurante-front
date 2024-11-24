import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuxService } from '../../services/aux-service.service';
import { VentasService } from '../../services/ventas.service';
import { SharedModule } from '../shared/shared.module';
import { CreateVentasComponent } from '../ventas/create-ventas/create-ventas.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleFacturasService } from '../../services/detalle-facturas.service';
import { CrearDetalleFacturaComponent } from './crear-detalle-factura/crear-detalle-factura.component';
import { Location } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css'],
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
    NzButtonModule,
    NzIconModule
  ],
  providers: [NzInputModule]
})
export class DetalleFacturaComponent implements OnInit {

  displayedColumns: string[] = [
    'nroFactura',
    'supervisor',  // Cambié de 'referenciaFactura' a 'numeroFactura' según tu modelo
    'plato',
    'valor',
];

// Nombres amigables de las columnas
columnNames = {
  nroFactura: 'Numero de factura',
  supervisor: 'Supervisor',  // Ajustado a tu modelo
  plato: 'Plato',
  valor: 'Valor',
};


  dates: any = {};
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];
  id: string | null = null;

  constructor(
    private Service: DetalleFacturasService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual

    this.dates = {
      FechaInicio: `${currentYear}-01-01`, // Establece la fecha de inicio al 1 de enero del año actual
      FechaFin: `${currentYear}-12-31`     // Establece la fecha de fin al 31 de diciembre del año actual
    };
  }

  goBack() {
    this.location.back();  // Navega a la página anterior
  }
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id){
      this.GetDetalleFactura();
    }
    //this.GetDetalleFactura();
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.GetDetalleFactura(); 
    // Aquí puedes manejar las fechas seleccionadas
  }

  GetDetalleFactura() {
    this.auxService.ventanaCargando();
    this.Service.get(`get-facturas/${this.id}`).subscribe({
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

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(CrearDetalleFacturaComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetDetalleFactura();
      }
    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CrearDetalleFacturaComponent, {
      data: { nroFactura: Number(this.id) },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetDetalleFactura();
      }
    });
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
          this.GetDetalleFactura();
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
