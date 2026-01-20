import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './Spinner';

describe('Spinner Component', () => {
    it('renders with default medium size', () => {
        render(<Spinner />);
        const spinner = screen.getByRole('status');
        expect(spinner).toBeInTheDocument();
    });

    it('renders with small size', () => {
        const { container } = render(<Spinner size="sm" />);
        const spinner = container.querySelector('.w-4');
        expect(spinner).toBeInTheDocument();
    });

    it('renders with large size', () => {
        const { container } = render(<Spinner size="lg" />);
        const spinner = container.querySelector('.w-12');
        expect(spinner).toBeInTheDocument();
    });

    it('has accessible ARIA label', () => {
        render(<Spinner />);
        expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<Spinner className="custom-class" />);
        const wrapper = container.firstChild;
        expect(wrapper).toHaveClass('custom-class');
    });

    it('has sr-only text for screen readers', () => {
        render(<Spinner />);
        const srText = screen.getByText('Loading...');
        expect(srText).toHaveClass('sr-only');
    });
});
