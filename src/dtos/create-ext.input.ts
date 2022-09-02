import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateExtInput {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image_id: string;

  @IsUrl()
  @IsOptional()
  image_url: string;

  @IsUrl()
  @IsOptional()
  youtube_url: string;
}
