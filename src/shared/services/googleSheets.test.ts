import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleSheetsService } from './googleSheets';

// Mock environment variable
// vi.stubEnv is unreliable with Vite's import.meta.env in some JSDOM setups
// We will spy on the private method via prototype or just mock the value if I expose it, 
// but easier: just rely on process.env fallback working OR mock the module if needed.
// Better approach: We refactored the service to have a static helper. We can spy on it.

describe('GoogleSheetsService', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch = vi.fn();

        // Mock the getScriptUrl method - requires casting to accessing private/static
        vi.spyOn(GoogleSheetsService as any, 'getScriptUrl').mockReturnValue('https://script.google.com/test');
    });

    describe('request', () => {
        it('includes auth token from localStorage in requests', async () => {
            localStorage.setItem('admin_auth_token', 'test-token-123');

            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({ success: true, data: [] })
            });

            await GoogleSheetsService.request({ action: 'getData' });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('test-token-123')
                })
            );
        });

        it('handles network errors gracefully', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const result = await GoogleSheetsService.getAllData();

            expect(result.success).toBe(false);
            expect(result.message).toBe('Network Error');
        });

        it('returns configuration error when SCRIPT_URL is missing', async () => {
            vi.spyOn(GoogleSheetsService as any, 'getScriptUrl').mockReturnValue(undefined);

            const result = await GoogleSheetsService.request({ action: 'test' });

            expect(result.success).toBe(false);
            expect(result.message).toBe('Configuration Error');
        });

        it('sends POST request with correct headers', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({ success: true })
            });

            await GoogleSheetsService.request({ action: 'test' });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' }
                })
            );
        });
    });

    describe('getAllData', () => {
        it('calls request with getData action', async () => {
            localStorage.setItem('admin_auth_token', 'test-token');

            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({ success: true, data: {} })
            });

            await GoogleSheetsService.getAllData();

            expect(global.fetch).toHaveBeenCalled();
            const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
            expect(callBody.action).toBe('getData');
        });
    });

    describe('createItem', () => {
        it('maps endpoint to correct action', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({ success: true })
            });

            await GoogleSheetsService.createItem('Projects', { title: 'Test' });

            const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
            expect(callBody.action).toBe('addProject');
        });
    });

    describe('updateItem', () => {
        it('handles Settings endpoint without ID', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({ success: true })
            });

            await GoogleSheetsService.updateItem('Settings', 'some-id', { theme: 'dark' });

            const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
            expect(callBody.id).toBeUndefined();
            expect(callBody.data).toEqual({ theme: 'dark' });
        });

        it('includes ID for regular endpoints', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({ success: true })
            });

            await GoogleSheetsService.updateItem('Projects', 'proj-123', { title: 'Updated' });

            const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
            expect(callBody.id).toBe('proj-123');
        });
    });

    describe('deleteItem', () => {
        it('sends delete action with ID', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({ success: true })
            });

            await GoogleSheetsService.deleteItem('Projects', 'proj-123');

            const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
            expect(callBody.action).toBe('deleteProject');
            expect(callBody.id).toBe('proj-123');
        });
    });

    describe('mapAction', () => {
        it('maps Messages update to updateMessageStatus', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({ success: true })
            });

            await GoogleSheetsService.updateItem('Messages', 'msg-123', { read: true });

            const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
            expect(callBody.action).toBe('updateMessageStatus');
        });
    });

    describe('login', () => {
        it('sends LOGIN action with password', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: async () => ({
                    success: true,
                    data: { token: 'new-token', expiresIn: 21600 }
                })
            });

            const result = await GoogleSheetsService.login('password123');

            const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
            expect(callBody.action).toBe('LOGIN');
            expect(callBody.data.password).toBe('password123');
            expect(result.success).toBe(true);
        });
    });
});
