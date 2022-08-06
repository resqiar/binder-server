import { IsString, IsUrl, MinLength } from 'class-validator';

export class CreateExtInput {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  image_url: string;
}
