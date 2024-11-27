export interface Folio {
  folioNumber: number;
  name: string;
  itemDetails: FolioItem[];
}

export interface FolioItem {
  itemName: string;
  itemFee: number;
}

export interface FolioDataResponse {
  id: number;
  name: string;
  email: string;
  folioData: FolioResponse[];
}

interface FolioResponse {
  id: number;
  folioNumber: number;
  folioDataId: number;
  name: string;
  FolioData?: FolioDataResponse;
  itemDetails: FolioItemResponse;
}

interface FolioItemResponse {
  id: number;
  itemName: string;
  itemFee: number;
  folioId?: number;
  Folio?: FolioResponse;
}
