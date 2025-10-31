import { describe, it, expect } from 'vitest';

describe('Basic Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
  
  it('can do math', () => {
    expect(2 + 2).toBe(4);
  });
});
