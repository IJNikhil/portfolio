import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkeletonLoader from './SkeletonLoader';

describe('SkeletonLoader', () => {
    it('renders card variant correctly', () => {
        const { container } = render(<SkeletonLoader variant="card" />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders list variant correctly', () => {
        const { container } = render(<SkeletonLoader variant="list" count={3} />);
        const items = container.querySelectorAll('.animate-pulse');
        expect(items.length).toBeGreaterThan(0);
    });

    it('renders text variant correctly', () => {
        const { container } = render(<SkeletonLoader variant="text" lines={5} />);
        const lines = container.querySelectorAll('.h-4');
        expect(lines.length).toBe(5);
    });

    it('respects custom count prop', () => {
        const { container } = render(<SkeletonLoader variant="list" count={5} />);
        const items = container.querySelectorAll('.space-y-4 > div');
        expect(items.length).toBe(5);
    });

    it('respects custom lines prop', () => {
        const { container } = render(<SkeletonLoader variant="text" lines={10} />);
        const lines = container.querySelectorAll('.h-4');
        expect(lines.length).toBe(10);
    });

    it('applies custom className', () => {
        const { container } = render(<SkeletonLoader variant="card" className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has pulse animation', () => {
        const { container } = render(<SkeletonLoader variant="card" />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });
});
