import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('applies primary variant styles by default', () => {
        render(<Button>Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-primary');
    });

    it('applies secondary variant styles', () => {
        render(<Button variant="secondary">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-white');
    });

    it('applies outline variant styles', () => {
        render(<Button variant="outline">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-transparent');
        expect(button).toHaveClass('border-border');
    });

    it('applies ghost variant styles', () => {
        render(<Button variant="ghost">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-transparent');
    });

    it('applies small size styles', () => {
        render(<Button size="sm">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-9');
    });

    it('applies medium size styles by default', () => {
        render(<Button>Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-11');
    });

    it('applies large size styles', () => {
        render(<Button size="lg">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-14');
    });

    it('shows loading spinner when isLoading is true', () => {
        render(<Button isLoading>Button</Button>);
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('disables button when isLoading is true', () => {
        render(<Button isLoading>Button</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button when disabled prop is true', () => {
        render(<Button disabled>Button</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('calls onClick handler when clicked', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Button</Button>);
        await user.click(screen.getByRole('button'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick} disabled>Button</Button>);
        await user.click(screen.getByRole('button'));

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('forwards additional props', () => {
        render(<Button data-testid="custom-button">Button</Button>);
        expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('has transition animation', () => {
        render(<Button>Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('transition-all');
    });

    it('has active scale effect', () => {
        render(<Button>Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('active:scale-[0.98]');
    });
});
