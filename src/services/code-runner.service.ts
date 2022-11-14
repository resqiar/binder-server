import { BadRequestException, Injectable } from '@nestjs/common';
import { CodeRunnerOutput } from 'src/controllers/code-runner.controller';
import { CodeRunnerInput } from 'src/dtos/code-runner.input';
import { createProject, ts } from '@ts-morph/bootstrap';
import axios from 'axios';
import tsc from 'typescript';

@Injectable()
export class CodeRunnerService {
  async callJdoodle(
    codeRunnerInput: CodeRunnerInput,
  ): Promise<CodeRunnerOutput> {
    let transpiledCode: string = '';

    if (codeRunnerInput.lang === 'typescript') {
      // Diagnostic error inside typescript code
      const error = await this.diagnosticTS(codeRunnerInput.code);
      if (error) throw new BadRequestException(error);
      // Transpile typescript code to javascipt code.
      // This must be done because JDoodle API only accept
      // javascipt code that will be run inside nodejs.
      transpiledCode = this.compileTS(codeRunnerInput.code);
    }

    // Body properties that we need to pass to Jdoodle,
    // more changes and props can be seen in the Jdoodle docs,
    // https://docs.jdoodle.com/integrating-compiler-ide-to-your-application/compiler-api
    const body = {
      script:
        codeRunnerInput.lang === 'typescript'
          ? transpiledCode
          : codeRunnerInput.code,
      language: codeRunnerInput.lang === 'c++' ? 'cpp' : 'nodejs',
      versionIndex: codeRunnerInput.lang === 'c++' ? '5' : '4',
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

  compileTS(code: string): string {
    const opts = {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2017,
        strict: true,
      },
    };

    // Transpile TS => JS with the compilerOptions.
    // This code should run after the diagnostics since
    // transpileModule API doesn't emit the error of the transpilation.
    return tsc.transpileModule(code, opts).outputText;
  }

  async diagnosticTS(code: string): Promise<string | null> {
    // In memory file system creation
    // https://github.com/dsherret/ts-morph/tree/latest/packages/bootstrap#file-systems
    const project = await createProject({ useInMemoryFileSystem: true });
    project.createSourceFile('temp.ts', code);

    // Create a new program to create a new diagnostics sessions
    // https://stackoverflow.com/questions/53733138/how-do-i-type-check-a-snippet-of-typescript-code-in-memory
    const program = project.createProgram();
    const diagnostics = ts.getPreEmitDiagnostics(program);

    if (!diagnostics.length) return null;
    return diagnostics[0].messageText.toString();
  }
}
