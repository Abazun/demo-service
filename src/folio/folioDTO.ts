import { IsNotEmpty } from 'class-validator';

export class FolioDTO {
  @IsNotEmpty()
  folioData: Folio[];
}

class Folio {
  @IsNotEmpty()
  folioNumber: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  itemDetails: FolioItem[];
}

class FolioItem {
  @IsNotEmpty()
  itemName: string;
  @IsNotEmpty()
  itemFee: number;
}
