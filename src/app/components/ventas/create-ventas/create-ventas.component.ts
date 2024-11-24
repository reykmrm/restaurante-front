import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { SharedModule } from '../../shared/shared.module';
import { parseISO } from 'date-fns';
import { AuxService } from '../../../services/aux-service.service';
import { VentasService } from '../../../services/ventas.service';
import { ClientesService } from '../../../services/clientes.service';
import { MeseroService } from '../../../services/mesero.service';
import { MesaService } from '../../../services/mesa.service';
import { FacturasService } from '../../../services/facturas.service';

@Component({
  selector: 'app-create-ventas',
  templateUrl: './create-ventas.component.html',
  styleUrls: ['./create-ventas.component.css'],
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
export class CreateVentasComponent implements OnInit {
  formularioForm: FormGroup;
  meseros: any;
  clientes: any;
  mesas: any;
  date = null;
  titulo = 'Crear venta';
  isReadonly: boolean = true;
  estapaDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private dateService: ClientesService,
    private meseroService: MeseroService,
    private mesaService: MesaService,
    private Service: VentasService,
    private facturasService: FacturasService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateVentasComponent>
  ) {
    this.formularioForm = this.fb.group({
      idCartera: [null], // id_cartera
      fecha: [new Date(), Validators.required], // fecha
      nroFactura: [0, ], // numero_factura
      nroMesa: ['', Validators.required], // mesa (replacing idUnidad as it corresponds to a "mesa")
      idMesero: ['', Validators.required], // mesero
      idCliente: ['', Validators.required],
      total: [0, Validators.required], // total (total_cartera)
    });

    // Patch values if editing
    if (this.data) {
      this.titulo = 'Editar venta';
      this.formularioForm.patchValue({
        idCartera: this.data.idCartera || 0, // id_cartera
        fecha: this.data.fecha ? parseISO(this.data.fecha) : null, // Fecha
        nroFactura: this.data.nroFactura || '', // numero_factura
        nroMesa: this.data.nroMesa || '', // mesa
        idMesero: this.data.idMesero || '', // mesero
        idCliente: this.data.idCliente || '', // mesero
        total: this.data.total || 0, // total
      });
    }   
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
    this.getMesero();
    this.getCliente();
    this.getMesa();
  }
  ngOnInit() {}

  onChange(result: any): void {
    console.log('onChange: ', result);
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  getMesero() {
    this.meseroService.get('').subscribe({
      next: (data: any) => {
        if (data) {
          this.meseros = data.data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error:any) => {
        this.auxService.AlertError('Error al cargar los roles:', error);
      },
    });
  }

  getMesa() {
    this.mesaService.get('').subscribe({
      next: (data: any) => {
        if (data) {
          this.mesas = data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error:any) => {
        this.auxService.AlertError('Error al cargar los roles:', error);
      },
    });
  }

  getCliente() {
    this.dateService.get('').subscribe({
      next: (data: any) => {
        if (data) {
          this.clientes = data.data;
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
    if (this.data) {
      this.updateFactura();
    } else {
      this.createFactura();
    }
  }

  updateFactura() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fecha: new Date(this.formularioForm.value.fecha)
          .toISOString()
          .split('T')[0],
      });
      this.facturasService
        .put(this.data.nroFactura, this.formularioForm.value)
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
      this.formularioForm.patchValue({
        fecha: new Date(this.formularioForm.value.fecha)
          .toISOString()
          .split('T')[0],
      });
      this.facturasService
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
