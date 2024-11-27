import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Folio, FolioDataResponse, FolioItem } from './folio';
import { FolioDTO } from './folioDTO';

@Injectable()
export class FolioService {
  constructor(private prisma: PrismaService) {}

  async getFolios(email: string): Promise<FolioDataResponse> {
    let folioResponse;

    await this.getFolioResponse(email).then(
      (folios) => {
        folioResponse = folios;
      },
      () => {
        this.throwError('malformed request');
      },
    );
    return folioResponse || null;
  }

  async createFolio(foData: FolioDTO): Promise<string> {
    if (await this.findFolios(foData.email)) {
      this.throwError('Invalid request');
    } else {
      if (await this.prisma.folioData.create(this.toFolioRequest(foData))) {
        return 'success';
      } else {
        this.throwError();
      }
    }
  }

  async updateFolio(foData: FolioDTO): Promise<string> {
    if (await this.findFolios(foData.email)) {
      if (
        await this.prisma.folioData.update({
          where: { email: foData.email },
          data: this.toFolioRequest(foData),
        })
      ) {
        return 'success';
      } else {
        this.throwError();
      }
    } else {
      this.throwError('Invalid request');
    }
  }

  private throwError(message?: string): void {
    throw new BadRequestException('Bad request ' + message, {
      cause: new Error(),
      description: 'Something went wrong',
    });
  }

  async findFolios(email: string) {
    return this.prisma.folioData.findUnique({
      where: {
        email: email,
      },
    });
  }

  async getFolioResponse(email: string) {
    return this.prisma.folioData.findUnique({
      where: {
        email: email,
      },
      include: {
        folioData: {
          include: {
            itemDetails: true,
          },
        },
      },
    });
  }

  private toFolioRequest(fData) {
    return {
      data: {
        name: fData.name,
        email: fData.email,
        folioData: {
          create: fData.folioData.map((folio: Folio) => {
            return {
              folioNumber: folio.folioNumber,
              name: folio.name,
              itemDetails: {
                create: folio.itemDetails.map((details: FolioItem) => {
                  return {
                    itemName: details.itemName,
                    itemFee: details.itemFee,
                  };
                }),
              },
            };
          }),
        },
      },
    };
  }
}
