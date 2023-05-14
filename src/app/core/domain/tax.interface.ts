export interface TaxModel {
  filingType: string;
  month: string;
  year: string;
  saleAmount: number;
  taxAmount: number;
  surcharge: number;
  penalty: number;
  totalAmount: number;
}
