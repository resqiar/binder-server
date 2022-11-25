import { Test, TestingModule } from '@nestjs/testing';
import { CodeRunnerService } from '../../services/code-runner.service';
import {
  CodeRunnerController,
  CodeRunnerOutput,
} from '../../controllers/code-runner.controller';
import { CodeRunnerInput } from '../../dtos/code-runner.input';

describe('CodeRunnerController', () => {
  let codeRunnerController: CodeRunnerController;

  const mockCodeRunnerService = {
    runCode: jest.fn((_: string) => {
      const result: CodeRunnerOutput = {
        cpuTime: '0.08',
        memory: '200',
        statusCode: 200,
        output: 'Hello World!',
      };
      return result;
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CodeRunnerController],
      providers: [
        {
          provide: CodeRunnerService,
          useValue: mockCodeRunnerService,
        },
      ],
    }).compile();

    codeRunnerController = app.get<CodeRunnerController>(CodeRunnerController);
  });

  it('should be defined', () => {
    expect(codeRunnerController).toBeDefined();
  });

  describe('Run Code Endpoint', () => {
    const input = new CodeRunnerInput();

    it('should be call the api and return CodeRunnerOutput', async () => {
      const res = expect.objectContaining({
        cpuTime: expect.any(String),
        memory: expect.any(String),
        statusCode: 200,
        output: expect.any(String),
      });
      await expect(codeRunnerController.runCode(input)).resolves.toEqual(res);
    });
  });
});
