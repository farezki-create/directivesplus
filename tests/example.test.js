import { expect, test } from 'vitest';

test('Math.sqrt()', () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
});
import { render, screen } from '@testing-library/react';
import { Slot } from '@radix-ui/react-slot';
import { expect, test } from 'vitest';

test('Slot renders children', () => {
  render(<Slot>Test</Slot>);
  expect(screen.getByText('Test')).toBeInTheDocument();
});