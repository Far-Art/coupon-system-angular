import {
  Injectable
} from '@angular/core';


@Injectable()
export class IdGeneratorService {

  constructor() { }

  generate(length?: number): string {
    return this.getRandomId(length || 6);
  }

  private getRandomId(length: number): string {
    return (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)).substring(0, length);
  }
}
