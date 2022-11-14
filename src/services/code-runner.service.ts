import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CodeRunnerOutput } from 'src/controllers/code-runner.controller';
import { CodeRunnerInput } from 'src/dtos/code-runner.input';

@Injectable()
export class CodeRunnerService {
  async callJdoodle(
    codeRunnerInput: CodeRunnerInput,
  ): Promise<CodeRunnerOutput> {
    // Body properties that we need to pass to Jdoodle,
    // more changes and props can be seen in the Jdoodle docs,
    // https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/compiler-api
    const body = {
      script: codeRunnerInput.code,
      language: 'nodejs',
      versionIndex: '0',
      clientId: process.env.JDOODLE_CLIENT_KEY,
      clientSecret: process.env.JDOODLE_SERVER_KEY,
    };

    try {
      // Call Jdoodle compiler api
      const response = await axios.post(
        'https://api.jdoodle.com/v1/execute',
        body,
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}
