import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DetalleFacturasService } from '../../../services/detalle-facturas.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuxService } from '../../../services/aux-service.service';
import { SharedModule } from '../../shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { format, parseISO } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  standalone: true,
  imports: [
    BaseChartDirective,
    BaseChartDirective,
    SharedModule,
    NzDatePickerModule,
    FormsModule,
  ],
})
export class ReportesComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Output() dateSelected = new EventEmitter<{
    FechaInicio: string;
    FechaFin: string;
  }>();
  date: any;
  dates: any = {};

  constructor(
    private readonly DetalleService: DetalleFacturasService,
    private readonly auxService: AuxService
  ) {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual

  this.dates = {
    FechaInicio: `${currentYear}-01-01`,
    FechaFin: `${currentYear}-12-31`,
  };
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.GetProductosVendidos();
    this.date = [parseISO(this.dates.FechaInicio), parseISO(this.dates.FechaFin)];
    console.log('fechas ',this.dates.FechaInicio);
  }

  public doughnutChartLabels: string[] = [];
  public doughnutChartData = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#FF6384', // Rojo-rosado
          '#36A2EB', // Azul
          '#FFCE56', // Amarillo
          '#4BC0C0', // Verde azulado
          '#9966FF', // Púrpura
          '#FF9F40', // Naranja
          '#00FF00', // Verde brillante
          '#FF4500', // Rojo anaranjado
          '#9400D3', // Violeta oscuro
        ],
      },
    ],
  };

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right', // Mantener la posición de la leyenda a la derecha
        labels: {
          padding: 20, // Aumentar el espacio entre las etiquetas y la gráfica
          font: {
            size: 12, // Ajustar el tamaño de la fuente de las etiquetas para que sean legibles
          },
          usePointStyle: true, // Hacer los puntos de las leyendas más pequeños
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0, // Eliminar padding extra si las etiquetas están a los lados
      },
    },
  };

  GetProductosVendidos() {
    this.auxService.ventanaCargando();

    this.DetalleService.post(`producto-mas-vendido`, this.dates).subscribe({
      next: (data: any[]) => {
        // Usa directamente el arreglo recibido
        this.doughnutChartData.labels = data.map((item: any) => item.producto);
        this.doughnutChartData.datasets[0].data = data.map(
          (item: any) => item.montoTotalFacturado
        );

        if (this.chart) {
          this.chart.update(); // Actualiza la gráfica
        }

        this.auxService.cerrarVentanaCargando();
      },
      error: (error: any) => {
        this.auxService.AlertError('Error al cargar los datos:', error);
      },
    });
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.GetProductosVendidos();
  }

  onChangedate(result: Date[]): void {
    if (result && result.length === 2) {
      // Obtener el primer día del mes del inicio
      const startDate = new Date(result[0].getFullYear(), result[0].getMonth(), 1);
  
      // Obtener el último día del mes del fin
      const endDate = new Date(result[1].getFullYear(), result[1].getMonth() + 1, 0);
  
      // Formatear las fechas al formato AAAA-MM-DD
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
      // Actualizar this.dates con las fechas seleccionadas en el input
      this.dates = {
        FechaInicio: formattedStartDate,
        FechaFin: formattedEndDate,
      };
  
      // Emitir las fechas actualizadas
      this.dateSelected.emit(this.dates);
  
      // Llamar al método para actualizar los datos
      this.GetProductosVendidos();
    } else if (!result || result.length === 0) {
      // Si el rango de fechas está vacío, usar el rango por defecto del año actual
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1); // 1 de enero
      const endOfYear = new Date(currentYear, 11, 31); // 31 de diciembre
  
      // Formatear las fechas al formato AAAA-MM-DD
      const formattedStartOfYear = format(startOfYear, 'yyyy-MM-dd');
      const formattedEndOfYear = format(endOfYear, 'yyyy-MM-dd');
  
      // Actualizar this.dates con las fechas predeterminadas (1 de enero - 31 de diciembre)
      this.dates = {
        FechaInicio: formattedStartOfYear,
        FechaFin: formattedEndOfYear,
      };
  
      // Restablecer el rango de fechas en el date picker
      this.date = [startOfYear, endOfYear];
  
      // Emitir las fechas restauradas
      this.dateSelected.emit(this.dates);
  
      // Llamar al método para actualizar los datos
      this.GetProductosVendidos();
    }
  }
  
  
}
