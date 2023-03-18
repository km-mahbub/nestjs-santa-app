import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import { differenceInYears } from 'date-fns';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { MailerService } from '../mailer/mailer.service';
import { ChristmasRequestDto } from './dtos/christmas-request.dto';
import { ChristmasRequest } from './christmas-request.entity';
import { ErrorResponse, OkResponse } from '../utils/types';

@Injectable()
export class ChristmasRequestService {
  private readonly logger = new Logger(ChristmasRequestService.name);
  private christmasRequests: ChristmasRequest[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  getPendingRequests() {
    return [...this.christmasRequests];
  }

  async addChristmasRequest(
    requestDto: ChristmasRequestDto,
  ): Promise<OkResponse> {
    const { username, requestText } = requestDto;

    const registeredUsers = await firstValueFrom(this.getRegisteredUsers());

    const user = registeredUsers.find((u) => u.username === username);

    if (!user) {
      throw new BadRequestException({
        statusCode: 2,
        message: 'Username is not registered',
      });
    }

    const userProfiles = await firstValueFrom(this.getUserProfiles());

    const userProfile = userProfiles.find((p) => p.userUid === user.uid);

    const age = this.calculateAge(new Date(userProfile.birthdate));

    if (age > 10) {
      throw new BadRequestException({
        statusCode: 3,
        message: 'User is more than 10 years old, thus cannot request a gift',
      });
    }

    const christmasRequest: ChristmasRequest = {
      id: uuidv4(),
      username: user.username,
      address: userProfile.address,
      requestText: requestText,
    };

    this.christmasRequests.push(christmasRequest);

    return {
      statusCode: 211,
      data: christmasRequest,
    };
  }

  async checkUsernameRegisteredStatus(username: string): Promise<OkResponse> {
    const registeredUsers = await firstValueFrom(this.getRegisteredUsers());

    const user = registeredUsers.find((u) => u.username === username);

    if (!user) {
      throw new BadRequestException({
        statusCode: 2,
        message: 'Username is not registered',
      });
    }

    return {
      statusCode: 212,
      data: user,
    };
  }

  private getRegisteredUsers() {
    return this.httpService.get(this.configService.get('USERS_LIST_LINK')).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new BadRequestException(error);
      }),
    );
  }

  private getUserProfiles() {
    return this.httpService
      .get(this.configService.get('USERS_PROFILE_LINK'))
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new BadRequestException(error);
        }),
      );
  }

  private calculateAge(birthDate: Date): number {
    const currentDate = new Date();
    return differenceInYears(currentDate, birthDate);
  }

  @Interval(15000)
  private async sendEmailsToSanta() {
    try {
      const pendingRequests = this.getPendingRequests();
      if (this.christmasRequests.length) {
        await this.mailerService.sendMail({
          to: this.configService.get<string>('MAIL_TO'),
          subject: "Santa's Good List",
          template: './pending-list.hbs',
          context: {
            pendingRequests: pendingRequests,
          },
        });
        this.christmasRequests = this.christmasRequests.filter(
          (a) => !pendingRequests.some((b) => a.id === b.id),
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
