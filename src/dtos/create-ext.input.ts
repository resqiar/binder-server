import {
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
} from 'class-validator';

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

  @IsString()
  @IsOptional()
  code_text: string;

  // Validate this field only when code_text is provided
  @ValidateIf((v) => v.code_text)
  @IsIn(['javascript', 'typescript', 'c++'])
  code_lang: 'javascript' | 'typescript' | 'c++';
}
