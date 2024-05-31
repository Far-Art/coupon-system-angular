import { ControlValuePipe } from './control-value.pipe';

describe('ControlValuePipe', () => {
  it('create an instance', () => {
    const pipe = new ControlValuePipe();
    expect(pipe).toBeTruthy();
  });
});
