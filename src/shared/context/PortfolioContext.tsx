import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { GoogleSheetsService } from "../services/googleSheets";
import { Project, Skill, Achievement, ServiceResponse, HeroProfile, Message, Resume, HeroData } from "../types/models";
import { toast } from "sonner";

// Re-export types for admin usage
export type { HeroData, Project, Skill, Achievement, Message, Resume };

interface PortfolioState {
    hero: HeroProfile | null;
    projects: Project[];
    skills: Skill[];
    achievements: Achievement[];
    messages: Message[];
    resumes: Resume[];
    settings: any;
    isLoading: boolean;
}

interface PortfolioContextType extends PortfolioState {
    refresh: () => Promise<void>;
    refreshData: () => Promise<void>; // Alias for Admin

    // Hero / Settings
    updateHero: (data: Partial<HeroProfile>) => Promise<void>;
    updateSettings: (data: any) => Promise<void>;

    // Projects
    createProject: (p: Omit<Project, "id">) => Promise<void>;
    addProject: (p: Omit<Project, "id">) => Promise<void>; // Alias
    updateProject: (id: string, p: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;

    // Skills
    addSkill: (s: Omit<Skill, "id">) => Promise<void>;
    updateSkill: (id: string, s: Partial<Skill>) => Promise<void>;
    deleteSkill: (id: string) => Promise<void>;

    // Achievements
    addAchievement: (a: Omit<Achievement, "id">) => Promise<void>;
    updateAchievement: (id: string, a: Partial<Achievement>) => Promise<void>;
    deleteAchievement: (id: string) => Promise<void>;

    // Resumes
    addResume: (r: Omit<Resume, "id">) => Promise<void>;
    deleteResume: (id: string) => Promise<void>;
    setResumeActive: (id: string) => Promise<void>;

    // Messages
    markMessageRead: (id: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;

    // Legacy support accessor
    data: PortfolioState;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Centralized State
    const [state, setState] = useState<PortfolioState>({
        hero: null,
        projects: [],
        skills: [],
        achievements: [],
        messages: [],
        resumes: [],
        settings: {},
        isLoading: true
    });

    const snapshotRef = useRef<PortfolioState>(state);

    const takeSnapshot = () => {
        snapshotRef.current = JSON.parse(JSON.stringify(state));
    };

    const rollback = () => {
        console.warn("Rolling back state due to API failure");
        setState(snapshotRef.current);
        toast.error("Action failed. Changes reverted.");
    };

    const setIsLoading = (loading: boolean) => setState(prev => ({ ...prev, isLoading: loading }));

    // 3. Data Fetching
    const refresh = async () => {
        setIsLoading(true);
        try {
            const response = await GoogleSheetsService.getAllData();

            if (response.success && response.data) {
                const d = response.data;
                console.log("Raw API Response:", d);
                console.log("Messages from API:", d.messages);

                // Helper to normalize
                const heroData = Array.isArray(d.hero) ? d.hero[0] : d.hero;
                const settingsData = Array.isArray(d.settings) ? d.settings[0] : d.settings;

                setState(prev => ({
                    ...prev,
                    hero: heroData || {},
                    projects: d.projects || [],
                    skills: d.skills || [],
                    achievements: d.achievements || [],
                    messages: d.messages || [],
                    resumes: d.resumes || [],
                    settings: settingsData || {},
                    isLoading: false
                }));
            } else {
                throw new Error(response.message || "Failed to fetch");
            }

        } catch (e) {
            console.error("Initialization Failed", e);
            toast.error("Failed to load portfolio data.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);


    // Shared Optimistic Handler
    const handleOptimisticAction = async (
        actionFn: () => void,
        apiCall: () => Promise<ServiceResponse<any>>
    ) => {
        takeSnapshot();
        actionFn();

        try {
            const response = await apiCall();
            if (!response.success) {
                rollback();
            } else {
                toast.success("Saved successfully");
            }
        } catch (error) {
            console.error(error);
            rollback();
        }
    };

    // --- Actions ---

    // Hero
    const updateHero = async (updates: Partial<HeroProfile>) => {
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, hero: { ...prev.hero!, ...updates } })),
            () => GoogleSheetsService.updateItem("Hero", "hero", updates) // Assuming single item "hero" or ID logic needed
        );
    };

    const updateSettings = async (updates: any) => {
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } })),
            () => GoogleSheetsService.updateItem("Settings", "settings", updates)
        );
    }

    // Projects
    const createProject = async (p: Omit<Project, "id">) => {
        const tempId = crypto.randomUUID();
        const newProject = { ...p, id: tempId } as Project;
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, projects: [newProject, ...prev.projects] })),
            () => GoogleSheetsService.createItem("Projects", newProject)
        );
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        await handleOptimisticAction(
            () => setState(prev => ({
                ...prev,
                projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            () => GoogleSheetsService.updateItem("Projects", id, updates)
        );
    };

    const deleteProject = async (id: string) => {
        await handleOptimisticAction(
            () => setState(prev => ({
                ...prev,
                projects: prev.projects.filter(p => p.id !== id)
            })),
            () => GoogleSheetsService.deleteItem("Projects", id)
        );
    };

    // Skills
    const addSkill = async (s: Omit<Skill, "id">) => {
        const tempId = crypto.randomUUID();
        const newSkill = { ...s, id: tempId } as Skill;
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, skills: [...prev.skills, newSkill] })),
            () => GoogleSheetsService.createItem("Skills", newSkill)
        );
    };

    const updateSkill = async (id: string, updates: Partial<Skill>) => {
        await handleOptimisticAction(
            () => setState(prev => ({
                ...prev,
                skills: prev.skills.map(s => s.id === id ? { ...s, ...updates } : s)
            })),
            () => GoogleSheetsService.updateItem("Skills", id, updates)
        );
    };

    const deleteSkill = async (id: string) => {
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) })),
            () => GoogleSheetsService.deleteItem("Skills", id)
        );
    };

    // Achievements
    const addAchievement = async (a: Omit<Achievement, "id">) => {
        const tempId = crypto.randomUUID();
        const newAchievement = { ...a, id: tempId } as Achievement;
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, achievements: [newAchievement, ...prev.achievements] })),
            () => GoogleSheetsService.createItem("Achievements", newAchievement)
        );
    };

    const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
        await handleOptimisticAction(
            () => setState(prev => ({
                ...prev,
                achievements: prev.achievements.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            () => GoogleSheetsService.updateItem("Achievements", id, updates)
        );
    };

    const deleteAchievement = async (id: string) => {
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, achievements: prev.achievements.filter(a => a.id !== id) })),
            () => GoogleSheetsService.deleteItem("Achievements", id)
        );
    };

    // Resumes
    const addResume = async (r: Omit<Resume, "id">) => {
        const tempId = crypto.randomUUID();
        const newResume = { ...r, id: tempId } as Resume;
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, resumes: [newResume, ...prev.resumes] })),
            () => GoogleSheetsService.createItem("Resumes", newResume)
        );
    }

    const deleteResume = async (id: string) => {
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, resumes: prev.resumes.filter(r => r.id !== id) })),
            () => GoogleSheetsService.deleteItem("Resumes", id)
        );
    }

    const setResumeActive = async (id: string) => {
        // Optimistic: toggle, unset others
        await handleOptimisticAction(
            () => setState(prev => ({
                ...prev,
                resumes: prev.resumes.map(r => ({ ...r, isActive: r.id === id }))
            })),
            // Assuming a specific endpoint or just updating the item. 
            // Ideally this should be a batch update or specific custom action. 
            // Faking it by just updating the specific one to true for now, 
            // but backend might need logic to unset others.
            () => GoogleSheetsService.updateItem("Resumes", id, { isActive: true })
        );
    };

    // Messages
    const markMessageRead = async (id: string) => {
        await handleOptimisticAction(
            () => setState(prev => ({
                ...prev,
                messages: prev.messages.map(m => m.id === id ? { ...m, status: "Read" } : m)
            })),
            () => GoogleSheetsService.updateItem("Messages", id, { status: "Read" })
        );
    };

    const deleteMessage = async (id: string) => {
        await handleOptimisticAction(
            () => setState(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) })),
            () => GoogleSheetsService.deleteItem("Messages", id)
        );
    };

    return (
        <PortfolioContext.Provider value={{
            ...state,
            data: state, // Legacy support
            refresh,
            refreshData: refresh,

            // Hero
            updateHero,
            updateSettings,

            // Projects
            createProject,
            addProject: createProject,
            updateProject,
            deleteProject,

            // Skills
            addSkill,
            updateSkill,
            deleteSkill,

            // Achievements
            addAchievement,
            updateAchievement,
            deleteAchievement,

            // Resumes
            addResume,
            deleteResume,
            setResumeActive,

            // Messages
            markMessageRead,
            deleteMessage
        }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) throw new Error("usePortfolio must be used within PortfolioProvider");
    return context;
};
