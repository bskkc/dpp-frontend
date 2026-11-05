export interface Product {
  gtin: string;
  modelName: string;
  batchNumber: string;
  cottonPercent: number;
  elastanePercent: number;
  productionLocation: string;
  carbonKgCo2e?: number | null;
  updatedAt: string;
}

export interface ImportRowError {
  rowNumber: number;
  message: string;
}

export interface ImportResult {
  totalRows: number;
  importedRows: number;
  invalidRows: number;
  errors: ImportRowError[];
}
