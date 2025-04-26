import { render, screen } from '@testing-library/react';
import { Slot } from '@radix-ui/react-slot';
import { expect, test } from 'vitest';

test('Slot renders children with asChild', () => {
  // Utilisation de Slot avec asChild et un élément enfant
  const Component = ({ children, ...props }) => (
    <Slot {...props}>{children}</Slot>
  );
  render(
    <Component asChild>
      <span>Test</span>
    </Component>
  );
  expect(screen.getByText('Test')).toBeInTheDocument();
});