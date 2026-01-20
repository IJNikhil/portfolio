import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { authService } from './authService';

describe('authService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('setSession', () => {
        it('stores token in localStorage', () => {
            authService.setSession('test-token-123');
            expect(localStorage.getItem('admin_auth_token')).toBe('test-token-123');
        });
    });

    describe('getToken', () => {
        it('returns null when no token exists', () => {
            expect(authService.getToken()).toBeNull();
        });

        it('returns token when it exists', () => {
            authService.setSession('valid-token');
            expect(authService.getToken()).toBe('valid-token');
        });
    });

    describe('isAuthenticated', () => {
        it('returns false when no token exists', () => {
            expect(authService.isAuthenticated()).toBe(false);
        });

        it('returns true when valid token exists', () => {
            authService.setSession('valid-long-token-12345');
            expect(authService.isAuthenticated()).toBe(true);
        });

        it('returns false for short tokens', () => {
            authService.setSession('short');
            expect(authService.isAuthenticated()).toBe(false);
        });

        it('returns false for placeholder token', () => {
            authService.setSession('secure-session-active');
            expect(authService.isAuthenticated()).toBe(false);
        });
    });

    describe('logout', () => {
        it('removes token from localStorage', () => {
            authService.setSession('test-token');

            // Mock window.location.href to prevent actual navigation
            const originalLocation = window.location;
            delete (window as any).location;
            window.location = { ...originalLocation, href: '' } as any;

            authService.logout();

            expect(localStorage.getItem('admin_auth_token')).toBeNull();

            // Restore original location
            window.location = originalLocation;
        });
    });
});
