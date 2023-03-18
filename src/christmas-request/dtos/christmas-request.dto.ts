import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class ChristmasRequestDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MaxLength(100)
  requestText: string;
}
