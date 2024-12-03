import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Folio, FolioDataResponse, FolioItem } from './folio';
import { FolioDTO } from './folioDTO';

@Injectable()
export class FolioService {
  constructor(private prisma: PrismaService) {}

  async getFolios(user): Promise<FolioDataResponse> {
    let folioResponse;

    await this.getFolioResponse(user.email).then(
      (folios) => {
        if (!!folios) {
          folioResponse = folios;
        } else {
          folioResponse = this.prisma.user.findUnique({
            where: {
              email: user.email
            }
          }).then((data) => {
            return {
              id: data.id,
              name: data.firstName + ' ' + data.lastName ? data.lastName : '',
              email: data.email,
              folioData: [],
            } as FolioDataResponse
          })
        }
      },
      () => {
        this.throwError('malformed request');
      },
    );

    return folioResponse || null;
  }

  async createFolio(foData: FolioDTO, user): Promise<FolioDataResponse> {
    if (await this.findFolios(user.email)) {
      this.throwError('Invalid request');
    } else {
      let userName: string = '';
      this.getName(user).then((name: string) => {
        userName = name;
      })
      return await this.doCreate(userName, foData, user);
    }
  }

  async updateFolio(foData: FolioDTO, user): Promise<FolioDataResponse> {
    let userName: string = '';
    if (await this.findFolios(user.email)) {
      this.getName(user).then((name: string) => {
        userName = name;
      })

      if (await this.prisma.folioData.delete({
        where: {
          email: user.email
        }
      })) {
        return await this.doCreate(userName, foData, user);
      } else {
        this.throwError('Bad Request');
      }
    } else {
      this.throwError('Invalid request');
    }
  }

  private async doCreate(userName: string, foData: FolioDTO, user) {
    if (await this.prisma.folioData.create(this.toFolioRequest(foData, userName, user.email))) {
      return await this.getFolios(user);
    } else {
      this.throwError('something happened');
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

  private toFolioRequest(fData, name: string, email: string) {
    return {
      data: {
        name: name,
        email: email,
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

  private async getName(user): Promise<string> {
    let name: string = '';
    await this.prisma.user.findUnique({
      where: {
        email: user.email
      }
    }).then((user) => {
      name = user.firstName + (user.lastName ? ' ' + user.lastName : '');
    });
    return name;
  }
}
