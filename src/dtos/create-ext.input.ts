import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateExtInput {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  image_url: string;
}
