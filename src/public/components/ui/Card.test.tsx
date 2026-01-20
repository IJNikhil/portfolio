import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card>Test Content</Card>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies glass variant styles', () => {
        const { container } = render(<Card variant="glass">Content</Card>);
        expect(container.firstChild).toHaveClass('glass-panel');
    });

    it('applies solid variant styles', () => {
        const { container } = render(<Card variant="solid">Content</Card>);
        expect(container.firstChild).toHaveClass('bg-surface');
    });

    it('defaults to solid variant', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild).toHaveClass('bg-surface');
    });

    it('applies hover effect when enabled', () => {
        const { container } = render(<Card hoverEffect>Content</Card>);
        expect(container.firstChild).toHaveClass('hover:shadow-lg');
    });

    it('does not apply hover effect by default', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild).not.toHaveClass('hover:shadow-lg');
    });

    it('applies custom className', () => {
        const { container } = render(<Card className="custom-class">Content</Card>);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('forwards additional props', () => {
        const { container } = render(<Card data-testid="card">Content</Card>);
        expect(container.firstChild).toHaveAttribute('data-testid', 'card');
    });

    it('has rounded corners', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild).toHaveClass('rounded-2xl');
    });

    it('has transition animation', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild).toHaveClass('transition-all');
    });
});
