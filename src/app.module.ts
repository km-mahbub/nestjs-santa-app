import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ChristmasRequestModule } from './christmas-request/christmas-request.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    MailerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ChristmasRequestModule,
  ],
})
export class AppModule {}
