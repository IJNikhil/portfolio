export interface Project {
    id: string;
    title: string;
    description: string;
    category: 'Web' | 'Mobile' | 'AI/ML' | 'Other'; // Strict Union Type
    techStack: string[];
    image?: string; // Main image URL
    liveUrl?: string; // For "Visit Site"
    isLive?: boolean; // For toggling visibility or "Live" badge? Using isLive to match admin usage
    repoUrl?: string; // Standardized name
    githubUrl?: string; // Legacy/Admin usage compatibility
    isFeatured: boolean;
    isVisible: boolean;
    skills?: string[]; // Admin usage seems to link projects to skills
}

export interface Skill {
    id: string;
    name: string;
    category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tools' | 'Core' | 'Other';
    icon?: string;
    proficiency?: number; // Optional 1-100
    isVisible: boolean;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string; // ISO or Year
    proofUrl?: string;
    image?: string;
    category: 'Certificate' | 'Award' | 'Hackathon' | 'Achievement' | 'Conference' | 'Other';
    isVisible: boolean;
}

export interface AuthResponse {
    token: string;
    expiresIn: number; // Unix Timestamp or Seconds
}

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    code?: number;
}

// User/Hero Metadata
// Matching Admin Usage: firstName, tagline, bio, secondaryBio, avatar, github, linkedin, terminalGreeting, terminalStack
export interface HeroProfile {
    // Basic Info
    name: string; // Internal or full name
    firstName?: string; // Admin usage
    headline: string; // or tagline
    tagline?: string; // Admin usage
    bio: string;
    secondaryBio?: string; // Admin usage
    email: string;

    // Images
    avatarUrl?: string;
    avatar?: string; // Admin usage

    // Resume
    resumeUrl?: string;

    // Socials (Flat structure for Admin compatibility often easier, or keeping it nested)
    // Admin uses flat: github, linkedin.
    socials: {
        github?: string;
        linkedin?: string;
        twitter?: string;
    };
    github?: string; // Admin usage alias
    linkedin?: string; // Admin usage alias

    // Terminal/Creative
    terminalGreeting?: string;
    greeting?: string; // Alias for terminalGreeting potentially
    terminalStack?: string[];

    // Custom Links
    customLinks?: { label: string; url: string }[];
}

// Alias for Admin Consumption
export type HeroData = HeroProfile;

export interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    date: string;
    timestamp?: string; // AdminInbox usage
    status: 'New' | 'Unread' | 'Read' | 'Replied';
}

export interface Resume {
    id: string;
    name: string;
    url: string;
    isActive: boolean;
    dateAdded: string;
}
