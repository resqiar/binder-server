import { IsString, MinLength } from 'class-validator';

export class CodeRunnerInput {
  @IsString()
  @MinLength(1)
  code: string;
}
