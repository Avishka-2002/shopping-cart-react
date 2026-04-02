import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app brand name', () => {
  render(<App />);
  const brandElement = screen.getByText(/FreshShop/i);
  expect(brandElement).toBeInTheDocument();
});
