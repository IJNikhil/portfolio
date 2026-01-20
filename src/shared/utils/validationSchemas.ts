import { z } from "zod";

// Project Validation Schema
export const projectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
    tags: z.array(z.string()).min(1, "Add at least one tag").max(10, "Too many tags"),
    category: z.string().min(1, "Category is required"),
    link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    image: z.string().optional(),
    featured: z.boolean().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Skill Validation Schema
export const skillSchema = z.object({
    name: z.string().min(2, "Skill name must be at least 2 characters").max(50, "Name is too long"),
    category: z.string().min(1, "Category is required"),
    level: z.number().min(1, "Level must be between 1-100").max(100, "Level must be between 1-100").optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// Achievement Validation Schema
export const achievementSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
    description: z.string().min(10, "Description must be at least 10 characters").max(300, "Description is too long"),
    date: z.string().min(1, "Date is required"),
    category: z.string().min(1, "Category is required"),
    icon: z.string().optional(),
    link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type AchievementFormData = z.infer<typeof achievementSchema>;

// Hero Profile Validation Schema
export const heroSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
    bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio is too long"),
    email: z.string().email("Must be a valid email address"),
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    avatar: z.string().optional(),
});

export type HeroFormData = z.infer<typeof heroSchema>;

// Contact Message Validation Schema
export const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    email: z.string().email("Must be a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Resume Validation Schema
export const resumeSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
    fileUrl: z.string().url("Must be a valid URL"),
    isActive: z.boolean().optional(),
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
