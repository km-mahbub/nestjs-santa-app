import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ChristmasRequestDto } from './dtos/christmas-request.dto';
import { ChristmasRequestService } from './christmas-request.service';
import { ValidationPipe } from '../utils/validation.pipe';

@Controller()
export class ChristmasRequestController {
  constructor(
    private readonly christmasRequestService: ChristmasRequestService,
  ) {}

  @Post('christmas-request')
  @UsePipes(new ValidationPipe(ChristmasRequestDto))
  addChristmasRequest(@Body() requestDto: ChristmasRequestDto) {
    return this.christmasRequestService.addChristmasRequest(requestDto);
  }

  @Get('check-username/:username')
  checkUsernameRegisteredStatus(@Param('username') username: string) {
    return this.christmasRequestService.checkUsernameRegisteredStatus(username);
  }
}
