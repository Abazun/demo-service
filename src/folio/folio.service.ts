import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Folio, FolioDataResponse, FolioItem } from './folio';
import { FolioDTO } from './folioDTO';
import { UserInfo } from "../users/user";

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

  async createFolio(foData: FolioDTO, user): Promise<string> {
    console.log(user);
    if (await this.findFolios(user.email)) {
      this.throwError('Invalid request');
    } else {
      let userName: string = '';
      this.getName(user).then((name: string) => {
        userName = name;
      })
      return await this.doCreate(userName, foData, user.email);
    }
  }

  async updateFolio(foData: FolioDTO, user): Promise<string> {
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
        return await this.doCreate(userName, foData, user.email);
      } else {
        this.throwError('Bad Request');
      }
    } else {
      this.throwError('Invalid request');
    }
  }

  private async doCreate(userName: string, foData: FolioDTO, email: string): Promise<string> {
    if (await this.prisma.folioData.create(this.toFolioRequest(foData, userName, email))) {
      return 'success';
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
    }).then((user: UserInfo) => {
      name = user.firstName + (user.lastName ? ' ' + user.lastName : '');
      console.log(name)
    });
    return name;
  }
}
