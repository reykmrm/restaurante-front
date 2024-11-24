import { MatPaginatorIntl } from '@angular/material/paginator';

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página';
  override nextPageLabel     = 'Siguiente';
  override previousPageLabel = 'Anterior';
  override firstPageLabel    = 'Primera';
  override lastPageLabel     = 'Última';

  // Añade el modificador override aquí
  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }
}
