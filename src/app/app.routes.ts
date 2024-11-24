import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { VentasComponent } from './components/ventas/ventas.component';
import { DetalleFacturaComponent } from './components/detalle-factura/detalle-factura.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';



export const routes: Routes = [
    { path: '', component: VentasComponent,  data: { requireIdEmpresa: false }}, 
    { path: 'ventas', component: VentasComponent,  data: { requireIdEmpresa: true }  },
    { path: 'detalle-factura/:id', component: DetalleFacturaComponent,  data: { requireIdEmpresa: true }  },
    { path: 'estadisticas', component: EstadisticasComponent,  data: { requireIdEmpresa: true }  },
];
 
