import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { parseISO } from 'date-fns';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AuxService } from '../../../services/aux-service.service';
import { ClientesService } from '../../../services/clientes.service';
import { FacturasService } from '../../../services/facturas.service';
import { MesaService } from '../../../services/mesa.service';
import { MeseroService } from '../../../services/mesero.service';
import { VentasService } from '../../../services/ventas.service';
import { SharedModule } from '../../shared/shared.module';
import { CreateVentasComponent } from '../../ventas/create-ventas/create-ventas.component';
import { SupervisorService } from '../../../services/supervisor.service';
import { DetalleFacturasService } from '../../../services/detalle-facturas.service';

@Component({
  selector: 'app-crear-detalle-factura',
  templateUrl: './crear-detalle-factura.component.html',
  styleUrls: ['./crear-detalle-factura.component.css'],
  standalone: true,
  imports: [
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    NzFormModule,
    NzDatePickerModule,
    NzSwitchModule,
  ],
})
export class CrearDetalleFacturaComponent implements OnInit {
  formularioForm: FormGroup;
  supervisores: any;
  date = null;
  // isSupervisor:boolean = false;
  titulo = 'Crear Detalle Factura';
  isReadonly: boolean = true;
  estapaDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private superService: SupervisorService,
    private Service: DetalleFacturasService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CrearDetalleFacturaComponent>
  ) {
    this.formularioForm = this.fb.group({
      idDetalleFactura: [0, ], // Número de factura
      nroFactura: [0, Validators.required], // Número de factura
      idSupervisor: ['', Validators.required], // Supervisor (asumiendo que será un select o input)
      plato: ['', Validators.required], // Plato (nombre o identificador del plato)
      valor: [0, Validators.required], // Valor total
    });
    
    // Patch values if editing
    if (this.data?.idSupervisor) {
      this.titulo = 'Editar Detalle Factura'; // Ajustar título según contexto
      this.formularioForm.patchValue({
        idDetalleFactura: this.data.idDetalleFactura || 0, // Número de factura
        nroFactura: this.data.nroFactura || 0, // Número de factura
        idSupervisor: this.data.idSupervisor || '', // Supervisor
        plato: this.data.plato || '', // Plato
        valor: this.data.valor || 0, // Valor total
      });
    }   
    if (this.data && !this.data.idSupervisor) {
      this.formularioForm.patchValue({
        nroFactura: this.data.nroFactura || 0, // Número de factura
      });
    }   
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
    this.getSupervisor();
  }
  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }



  getSupervisor() {
    this.superService.get('').subscribe({
      next: (data: any) => {
        if (data) {
          this.supervisores = data.data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error:any) => {
        this.auxService.AlertError('Error al cargar los roles:', error);
      },
    });
  }

  guardarCambios() {
    if (this.data && this.data.idDetalleFactura) {
      this.updateFactura();
    } else {
      this.createFactura();
    }
  }

  updateFactura() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.Service
        .put(this.data.idDetalleFactura, this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos actualizados correctamente',
                ''
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error al actualizar el registro',
                data.message
              );
            }
          },
          error: (error:any) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al actualizar el registro',
              error.message
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Formulario inválido',
        'Por favor, revisa los campos y corrige los errores.'
      );
    }
  }

  createFactura() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.Service
        .post('', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos registrados correctamente',
                ''
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error al crear el registro',
                data.message
              );
            }
          },
          error: (error:any) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al crear el registro',
              error.message
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Formulario inválido',
        'Por favor, revisa los campos y corrige los errores.'
      );
    }
  }

}
