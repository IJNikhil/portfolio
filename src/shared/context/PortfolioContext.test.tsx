import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PortfolioProvider, usePortfolio } from './PortfolioContext';
import { GoogleSheetsService } from '../services/googleSheets';

// Mock the service
vi.mock('../services/googleSheets');

// Test component to access context
function TestComponent() {
    const context = usePortfolio();
    return (
        <div>
            <div data-testid="projects-count">{context.projects.length}</div>
            <div data-testid="skills-count">{context.skills.length}</div>
            <div data-testid="loading">{context.isLoading ? 'loading' : 'loaded'}</div>
        </div>
    );
}

describe('PortfolioContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('provides initial empty state', () => {
        vi.mocked(GoogleSheetsService.getAllData).mockResolvedValue({
            success: true,
            data: {
                projects: [],
                skills: [],
                achievements: [],
                hero: null,
                resumes: [],
                settings: null,
                messages: []
            }
        });

        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        expect(screen.getByTestId('projects-count')).toHaveTextContent('0');
        expect(screen.getByTestId('skills-count')).toHaveTextContent('0');
    });

    it('loads data on mount', async () => {
        const mockData = {
            projects: [{ id: '1', title: 'Test Project' }],
            skills: [{ id: '1', name: 'React' }],
            achievements: [],
            hero: null,
            resumes: [],
            settings: null,
            messages: []
        };

        vi.mocked(GoogleSheetsService.getAllData).mockResolvedValue({
            success: true,
            data: mockData
        });

        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
        });

        expect(screen.getByTestId('projects-count')).toHaveTextContent('1');
        expect(screen.getByTestId('skills-count')).toHaveTextContent('1');
    });

    it('handles API errors gracefully', async () => {
        vi.mocked(GoogleSheetsService.getAllData).mockResolvedValue({
            success: false,
            message: 'Network error'
        });

        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
        });

        // Should still render with empty data
        expect(screen.getByTestId('projects-count')).toHaveTextContent('0');
    });

    it('sets loading state correctly', async () => {
        vi.mocked(GoogleSheetsService.getAllData).mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve({
                success: true,
                data: {
                    projects: [],
                    skills: [],
                    achievements: [],
                    hero: null,
                    resumes: [],
                    settings: null,
                    messages: []
                }
            }), 100))
        );

        render(
            <PortfolioProvider>
                <TestComponent />
            </PortfolioProvider>
        );

        // Should be loading initially
        expect(screen.getByTestId('loading')).toHaveTextContent('loading');

        // Should finish loading
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
        }, { timeout: 200 });
    });
});
