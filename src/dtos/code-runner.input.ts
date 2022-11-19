import { IsIn, IsString, MinLength } from 'class-validator';

export class CodeRunnerInput {
  @IsString()
  @MinLength(1)
  code: string;

  @IsString()
  @IsIn(['javascript', 'typescript', 'c++'])
  lang: 'javascript' | 'typescript' | 'c++';
}
