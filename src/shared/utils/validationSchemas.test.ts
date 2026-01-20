import { describe, it, expect } from 'vitest';
import {
    projectSchema,
    skillSchema,
    achievementSchema,
    contactSchema,
    heroSchema,
} from './validationSchemas';

describe('Validation Schemas', () => {
    describe('projectSchema', () => {
        it('validates correct project data', () => {
            const validProject = {
                title: 'Test Project',
                description: 'A comprehensive test project description',
                tags: ['React', 'TypeScript'],
                category: 'Web',
                link: 'https://example.com',
                github: 'https://github.com/user/repo',
            };

            const result = projectSchema.safeParse(validProject);
            expect(result.success).toBe(true);
        });

        it('rejects title less than 3 characters', () => {
            const invalidProject = {
                title: 'AB',
                description: 'Valid description here',
                tags: ['React'],
                category: 'Web',
            };

            const result = projectSchema.safeParse(invalidProject);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('at least 3');
            }
        });

        it('rejects description less than 10 characters', () => {
            const invalidProject = {
                title: 'Valid Title',
                description: 'Short',
                tags: ['React'],
                category: 'Web',
            };

            const result = projectSchema.safeParse(invalidProject);
            expect(result.success).toBe(false);
        });

        it('rejects invalid URL format', () => {
            const invalidProject = {
                title: 'Valid Title',
                description: 'Valid description here',
                tags: ['React'],
                category: 'Web',
                link: 'not-a-valid-url',
            };

            const result = projectSchema.safeParse(invalidProject);
            expect(result.success).toBe(false);
        });

        it('accepts empty string for optional URL fields', () => {
            const validProject = {
                title: 'Test Project',
                description: 'Valid description here',
                tags: ['React'],
                category: 'Web',
                link: '',
                github: '',
            };

            const result = projectSchema.safeParse(validProject);
            expect(result.success).toBe(true);
        });

        it('requires at least one tag', () => {
            const invalidProject = {
                title: 'Valid Title',
                description: 'Valid description here',
                tags: [],
                category: 'Web',
            };

            const result = projectSchema.safeParse(invalidProject);
            expect(result.success).toBe(false);
        });
    });

    describe('skillSchema', () => {
        it('validates correct skill data', () => {
            const validSkill = {
                name: 'React',
                category: 'Frontend',
                level: 85,
            };

            const result = skillSchema.safeParse(validSkill);
            expect(result.success).toBe(true);
        });

        it('rejects level above 100', () => {
            const invalidSkill = {
                name: 'React',
                category: 'Frontend',
                level: 150,
            };

            const result = skillSchema.safeParse(invalidSkill);
            expect(result.success).toBe(false);
        });

        it('rejects level below 1', () => {
            const invalidSkill = {
                name: 'React',
                category: 'Frontend',
                level: 0,
            };

            const result = skillSchema.safeParse(invalidSkill);
            expect(result.success).toBe(false);
        });

        it('accepts skill without level', () => {
            const validSkill = {
                name: 'React',
                category: 'Frontend',
            };

            const result = skillSchema.safeParse(validSkill);
            expect(result.success).toBe(true);
        });
    });

    describe('achievementSchema', () => {
        it('validates correct achievement data', () => {
            const validAchievement = {
                title: 'Won Hackathon',
                description: 'First place in national coding competition',
                date: '2024-01-15',
                category: 'Competition',
            };

            const result = achievementSchema.safeParse(validAchievement);
            expect(result.success).toBe(true);
        });

        it('accepts optional link field', () => {
            const validAchievement = {
                title: 'Won Hackathon',
                description: 'First place in national coding competition',
                date: '2024-01-15',
                category: 'Competition',
                link: 'https://example.com/certificate',
            };

            const result = achievementSchema.safeParse(validAchievement);
            expect(result.success).toBe(true);
        });
    });

    describe('contactSchema', () => {
        it('validates correct contact data', () => {
            const validContact = {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'This is a valid message with enough characters',
            };

            const result = contactSchema.safeParse(validContact);
            expect(result.success).toBe(true);
        });

        it('rejects invalid email format', () => {
            const invalidContact = {
                name: 'John Doe',
                email: 'not-an-email',
                message: 'Valid message here',
            };

            const result = contactSchema.safeParse(invalidContact);
            expect(result.success).toBe(false);
        });

        it('rejects message less than 10 characters', () => {
            const invalidContact = {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Short',
            };

            const result = contactSchema.safeParse(invalidContact);
            expect(result.success).toBe(false);
        });
    });

    describe('heroSchema', () => {
        it('validates correct hero profile data', () => {
            const validHero = {
                name: 'John Doe',
                title: 'Full Stack Developer',
                bio: 'Passionate developer with 5 years of experience',
                email: 'john@example.com',
                github: 'https://github.com/johndoe',
                linkedin: 'https://linkedin.com/in/johndoe',
            };

            const result = heroSchema.safeParse(validHero);
            expect(result.success).toBe(true);
        });

        it('rejects invalid email', () => {
            const invalidHero = {
                name: 'John Doe',
                title: 'Developer',
                bio: 'Experienced developer',
                email: 'invalid-email',
            };

            const result = heroSchema.safeParse(invalidHero);
            expect(result.success).toBe(false);
        });

        it('accepts empty strings for optional social URLs', () => {
            const validHero = {
                name: 'John Doe',
                title: 'Developer',
                bio: 'Experienced developer',
                email: 'john@example.com',
                github: '',
                linkedin: '',
                twitter: '',
            };

            const result = heroSchema.safeParse(validHero);
            expect(result.success).toBe(true);
        });
    });
});
