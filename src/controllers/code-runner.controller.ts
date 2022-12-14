import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CodeRunnerInput } from '../dtos/code-runner.input';
import { CodeRunnerService } from '../services/code-runner.service';

export interface CodeRunnerOutput {
  output: string;
  statusCode: number;
  memory: string;
  cpuTime: string;
}

@Controller('code')
export class CodeRunnerController {
  constructor(private readonly codeRunnerService: CodeRunnerService) {}

  @Post('run')
  async runCode(
    @Body(new ValidationPipe()) codeRunnerInput: CodeRunnerInput,
  ): Promise<CodeRunnerOutput> {
    return await this.codeRunnerService.runCode(codeRunnerInput);
  }
}
