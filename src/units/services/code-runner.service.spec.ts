import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CodeRunnerOutput } from '../../controllers/code-runner.controller';
import { CodeRunnerInput } from '../../dtos/code-runner.input';
import { CodeRunnerService } from '../../services/code-runner.service';

describe('CodeRunnerService', () => {
  let codeRunnerService: CodeRunnerService;
  let mockCallAPI: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CodeRunnerService],
    }).compile();

    codeRunnerService = app.get<CodeRunnerService>(CodeRunnerService);
    /**
     * Mocking a specal JDoodle API call.
     * Why it should be mocked with the custom value like this?
     * the answer is pretty simple, this is only unit test and should not
     * use environtment variables / private credentials.
     **/
    mockCallAPI = jest.spyOn(codeRunnerService, 'callJDoodle');
    const expectedResult: CodeRunnerOutput = {
      cpuTime: '0.08',
      memory: '200',
      statusCode: 200,
      output: 'Hello World!',
    };
    mockCallAPI.mockResolvedValue(expectedResult);
  });

  it('should be defined', () => {
    expect(codeRunnerService).toBeDefined();
  });

  describe('Run Code Service', () => {
    const expectedResult: CodeRunnerOutput = {
      cpuTime: expect.any(String),
      memory: expect.any(String),
      statusCode: 200,
      output: 'Hello World!',
    };

    it('should be defined', () => {
      expect(codeRunnerService.runCode).toBeDefined();
    });

    it('should call "callJdoodle" function and return CodeRunnerOutput', async () => {
      // Input to callJdoodle
      const input: CodeRunnerInput = new CodeRunnerInput();
      input.code = "console.log('test')";
      input.lang = 'javascript';

      await expect(codeRunnerService.runCode(input)).resolves.toEqual(
        expectedResult,
      );
      expect(mockCallAPI).toHaveBeenCalled();
    });

    it('should call diagnosticTS if the lang is TypeScript', async () => {
      // Spy on diagnosticTS function
      const mockDiagnosticTS: jest.SpyInstance = jest.spyOn(
        codeRunnerService,
        'diagnosticTS',
      );

      const input: CodeRunnerInput = new CodeRunnerInput();
      input.code = "console.log('test');";
      input.lang = 'typescript';

      await expect(codeRunnerService.runCode(input)).resolves.toEqual(
        expectedResult,
      );
      expect(mockDiagnosticTS).toHaveBeenCalled();
    });

    it('should return error if the TypeScript code contains error', async () => {
      const input: CodeRunnerInput = new CodeRunnerInput();
      // TS code that contains a type error
      input.code = `
        let status: boolean;
        status = 123;
        console.log(status);
      `;
      input.lang = 'typescript';

      await expect(codeRunnerService.runCode(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call compileTS if the lang is TypeScript', async () => {
      const mockCompileTS: jest.SpyInstance = jest.spyOn(
        codeRunnerService,
        'compileTS',
      );

      const input: CodeRunnerInput = new CodeRunnerInput();
      input.code = "console.log('test');";
      input.lang = 'typescript';

      await expect(codeRunnerService.runCode(input)).resolves.toEqual(
        expectedResult,
      );
      expect(mockCompileTS).toHaveBeenCalled();
    });
  });

  describe('Compile TS Service', () => {
    it('should be defined', () => {
      expect(codeRunnerService.compileTS).toBeDefined();
    });

    it('should compile TypeScript code into JavaScript', () => {
      const tsCode = `
        interface User {
          id: number,
          name: string,
          roommate: User
        }

        const std1: User = {
          id: 1,
          name: "John Dale",
          roommate: std2
        }
        const std2: User = {
          id: 2,
          name: "Maria Nagdalena",
          roommate: std1
        }
      `;

      /**
       *****************************************************
       * Never change the indentation of the variable below,
       * if you somehow change the indentation or spaces format, the test
       * will be failed because of that problem. Maybe the tsCode is too long.
       *****************************************************
       **/
      const expectedTranspiled = `"use strict";
const std1 = {
    id: 1,
    name: \"John Dale\",
    roommate: std2
};
const std2 = {
    id: 2,
    name: \"Maria Nagdalena\",
    roommate: std1
};
`;
      /**
       *****************************************************
       * Never change the indentation of the variable above,
       * if you somehow change the indentation or spaces format, the test
       * will be failed because of that problem. Maybe the tsCode is too long.
       *****************************************************
       **/
      expect(codeRunnerService.compileTS(tsCode)).toBe(expectedTranspiled);
    });
  });

  describe('Diagnostic TS Service', () => {
    it('should be defined', () => {
      expect(codeRunnerService.diagnosticTS).toBeDefined();
    });

    it('should return error message if the TS code contains error', async () => {
      const tsCode = `
         let mustBeBool: boolean = true;
         mustBeBool = 123;
      `;
      const expectedMessage =
        "Type 'number' is not assignable to type 'boolean'.";

      await expect(codeRunnerService.diagnosticTS(tsCode)).resolves.toEqual(
        expectedMessage,
      );
    });

    it('should return NULL if the TS code does not contains any error', async () => {
      const tsCode = `
         let mustBeBool: boolean = true;
         mustBeBool = false;
      `;

      await expect(codeRunnerService.diagnosticTS(tsCode)).resolves.toEqual(
        null,
      );
    });
  });
});
