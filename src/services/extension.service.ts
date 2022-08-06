import { Injectable } from '@nestjs/common';

@Injectable()
export class ExtensionService {
  get(): string {
    return 'Extensions!';
  }
}
