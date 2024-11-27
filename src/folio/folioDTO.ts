import { IsEmail, IsNotEmpty } from 'class-validator';

export class FolioDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  folioData: Folio[];
  @IsEmail()
  @IsNotEmpty()
  email: string;
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
