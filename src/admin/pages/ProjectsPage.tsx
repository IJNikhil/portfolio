import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { usePortfolio, Project } from "../../shared/context/PortfolioContext";
import { toast } from "sonner";
import { ImageUploader } from "../components/ui/ImageUploader";
import { githubService, GitHubRepo } from "../../shared/services/githubService";
import { Input, TextArea, Select, TitleInput } from "../components/ui/Inputs";

export default function ProjectsPage() {
    const { hero, projects, skills, addProject, updateProject, deleteProject, refreshData } = usePortfolio();
    const [searchParams, setSearchParams] = useSearchParams();

    // Selection state
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isCreating, setIsCreating] = useState(false);


    // Import State
    const [showImportModal, setShowImportModal] = useState(false);
    const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
    const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);
    const [isLoadingRepos, setIsLoadingRepos] = useState(false);

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Web", "Mobile", "Desktop", "AI/ML", "Other"];
    const formCategories = categories.filter(c => c !== "All");

    // Form State
    const [formData, setFormData] = useState<Partial<Project>>({
        title: "", description: "", category: "Web", liveUrl: "", githubUrl: "", image: "", skills: [], readme: "", isVisible: true, isFeatured: false, isLive: true
    });

    // Skills Management State
    const [skillSearch, setSkillSearch] = useState("");
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);

    // Filter Logic
    const filteredProjects = useMemo(() => {
        let result = projects;

        if (activeCategory !== "All") {
            result = result.filter(p => p.category === activeCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        }

        return result;
    }, [projects, activeCategory, searchQuery]);

    // Handle URL Params for navigation
    useEffect(() => {
        const createMode = searchParams.get("create");
        const editId = searchParams.get("edit");

        if (createMode === "true") {
            handleCreateNew();
        } else if (editId) {
            const proj = projects.find(p => p.id === editId);
            if (proj && selectedProject?.id !== proj.id) handleSelect(proj);
        }
    }, [searchParams, projects]);

    const handleSelect = (project: Project) => {
        setIsCreating(false);
        setSelectedProject(project);
        setFormData(project);
        setSkillSearch("");
    };

    const handleCreateNew = () => {
        setSelectedProject(null);
        setIsCreating(true);
        setFormData({
            title: "", description: "", category: "Web", liveUrl: "", githubUrl: "", image: "",
            skills: [], readme: "", isVisible: true, isFeatured: false, isLive: true
        });
        setSkillSearch("");
    };

    // GitHub Import Logic
    const openImportModal = async () => {
        // Extract username from Hero or Settings (fallback)
        let username = "";
        if (hero?.github) {
            const match = hero.github.match(/github\.com\/([^\/]+)/);
            if (match && match[1]) username = match[1];
            else username = hero.github.split("/").pop() || "";
        }

        if (!username) {
            toast.error("Please set your GitHub URL in the Content / Hero section first.");
            return;
        }

        setShowImportModal(true);
        setIsLoadingRepos(true);
        try {
            const repos = await githubService.fetchUserRepos(username);
            setGithubRepos(repos); // Show ALL repos
        } catch (e) {
            toast.error("Failed to fetch repositories. Check your username.");
            setShowImportModal(false);
        } finally {
            setIsLoadingRepos(false);
        }
    };

    const isRepoImported = (repoUrl: string) => {
        return projects.some(p => p.githubUrl?.toLowerCase() === repoUrl.toLowerCase());
    };

    const toggleRepoSelection = (repoId: number, repoUrl: string) => {
        if (isRepoImported(repoUrl)) return;
        setSelectedRepoIds(prev =>
            prev.includes(repoId) ? prev.filter(id => id !== repoId) : [...prev, repoId]
        );
    };

    const handleImportProjects = async () => {
        const selectedRepos = githubRepos.filter(r => selectedRepoIds.includes(r.id));
        if (selectedRepos.length === 0) return;

        setShowImportModal(false);
        const promise = (async () => {
            for (const repo of selectedRepos) {
                const newProject: Partial<Project> = {
                    title: repo.name.replace(/-/g, " ").replace(/_/g, " "), // Clean title
                    description: repo.description || "",
                    category: "Web", // Default
                    liveUrl: repo.homepage || "",
                    githubUrl: repo.html_url,
                    image: "", // Placeholder
                    skills: [...(repo.language ? [repo.language] : []), ...(repo.topics || [])],
                    readme: "",
                    isVisible: true,
                    isFeatured: false,
                    isLive: true
                };
                await addProject(newProject as Project);
            }
        })();

        toast.promise(promise, {
            loading: `Importing ${selectedRepos.length} projects...`,
            success: 'Import complete!',
            error: 'Import failed'
        });

        await promise;
        setSelectedRepoIds([]);
    };



    const handleReadmeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, readme: reader.result as string }));
                toast.success("Readme file loaded!");
            };
            reader.readAsText(file);
        }
    }

    // Skills Logic
    const handleAddSkill = async (skillName: string) => {
        if (formData.skills?.some(s => s.toLowerCase() === skillName.toLowerCase())) {
            setSkillSearch("");
            setShowSkillDropdown(false);
            return;
        }

        // Canonical Name Check
        const existingSkill = skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
        const finalSkillName = existingSkill ? existingSkill.name : skillName;

        const newSkills = [...(formData.skills || []), finalSkillName];
        setFormData({ ...formData, skills: newSkills });
        setSkillSearch("");
        setShowSkillDropdown(false);
    };

    const handleRemoveSkill = (skillName: string) => {
        setFormData({
            ...formData,
            skills: formData.skills?.filter(s => s !== skillName)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = { ...formData };

        try {
            if (isCreating) {
                const promise = addProject(finalData as Project);
                toast.promise(promise, {
                    loading: 'Creating project...',
                    success: 'Project created successfully!',
                    error: 'Failed to create project'
                });
                await promise;
                await refreshData(); // Force sync with backend
                setSearchParams({});
                setIsCreating(false);
                setSelectedProject(null); // Clear selection to show list
            } else if (selectedProject) {
                const promise = updateProject({ ...selectedProject, ...finalData } as Project);
                toast.promise(promise, {
                    loading: 'Updating project...',
                    success: 'Project updated successfully!',
                    error: 'Failed to update project'
                });
                await promise;
                await refreshData(); // Force sync with backend
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (selectedProject && window.confirm(`Delete "${selectedProject.title}"?`)) {
            const promise = deleteProject(selectedProject.id);
            toast.promise(promise, {
                loading: 'Deleting project...',
                success: 'Project deleted!',
                error: 'Failed to delete project'
            });
            await promise;
            setSelectedProject(null);
            setSearchParams({});
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] gap-0 bg-white md:border border-[#DADCE0] md:rounded-lg shadow-sm overflow-hidden relative">
            {/* Import Modal */}
            {showImportModal && (
                <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-0 md:p-8 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white md:rounded-xl shadow-2xl w-full max-w-3xl h-full md:h-[80vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-[#DADCE0] flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-[#202124]">Import from GitHub</h3>
                                <p className="text-sm text-[#5F6368]">Select public repositories to add to your portfolio.</p>
                            </div>
                            <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            {isLoadingRepos ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="size-10 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-medium">Fetching repositories...</p>
                                </div>
                            ) : githubRepos.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-gray-500">No new public repositories found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {githubRepos.map(repo => {
                                        const isImported = isRepoImported(repo.html_url);
                                        const isSelected = selectedRepoIds.includes(repo.id);

                                        return (
                                            <div
                                                key={repo.id}
                                                onClick={() => toggleRepoSelection(repo.id, repo.html_url)}
                                                className={`p-4 rounded-lg border-2 transition-all ${isImported
                                                    ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'border-[#1A73E8] bg-[#E8F0FE] cursor-pointer'
                                                        : 'border-transparent bg-white shadow-sm hover:border-gray-200 cursor-pointer'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className={`font-bold truncate ${isImported ? 'text-gray-500' : isSelected ? 'text-[#1967D2]' : 'text-[#3C4043]'}`}>
                                                        {repo.name}
                                                    </h4>
                                                    {isImported ? (
                                                        <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-500 px-2 py-1 rounded">Added</span>
                                                    ) : isSelected && (
                                                        <span className="material-symbols-outlined text-[#1A73E8]">check_circle</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-[#5F6368] line-clamp-2 mb-3 h-8">
                                                    {repo.description || "No description"}
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {repo.language && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono">
                                                            {repo.language}
                                                        </span>
                                                    )}
                                                    {repo.topics.slice(0, 3).map(t => (
                                                        <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-[#DADCE0] bg-white flex flex-col-reverse md:flex-row justify-end gap-3 shrink-0 safepadding-bottom">
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="px-5 py-3 md:py-2 text-sm font-medium text-[#5F6368] hover:bg-gray-100 rounded-md transition-colors w-full md:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImportProjects}
                                disabled={selectedRepoIds.length === 0}
                                className={`px-6 py-3 md:py-2 text-sm font-bold text-white rounded-md transition-all flex items-center justify-center gap-2 w-full md:w-auto ${selectedRepoIds.length > 0
                                    ? 'bg-[#1A73E8] hover:bg-[#1557B0] shadow-sm'
                                    : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">download</span>
                                Import Selected ({selectedRepoIds.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Sidebar: List & filters */}
            {/* Logic: Hidden on mobile IF we have a selected project or creating new */}
            <div className={`w-full md:w-[350px] flex flex-col border-r border-[#DADCE0] bg-gray-50 ${(selectedProject || isCreating) ? "hidden md:flex" : "flex"
                }`}>
                {/* Search Header */}
                <div className="p-4 border-b border-[#DADCE0] space-y-3 bg-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider">Projects</h2>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{projects.length}</span>
                        </div>
                        {/* Import Button in Header */}
                        <button
                            onClick={openImportModal}
                            className="text-[#1A73E8] hover:bg-[#E8F0FE] p-1.5 rounded-full transition-colors"
                            title="Import from GitHub"
                        >
                            <span className="material-symbols-outlined text-lg">cloud_download</span>
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            placeholder="Search projects..."
                            icon="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-fade">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeCategory === cat
                                    ? "bg-[#1A73E8] text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto w-full pb-24">
                    <button
                        onClick={handleCreateNew}
                        className="hidden md:flex mx-4 mt-3 mb-2 items-center justify-center gap-2 py-2 border border-dashed border-[#DADCE0] rounded-lg text-[#1A73E8] text-sm font-medium hover:bg-[#F8F9FA] transition-colors w-[calc(100%-2rem)]"
                    >
                        <span className="material-symbols-outlined text-lg">add_box</span>
                        Create New Project
                    </button>

                    <div className="divide-y divide-[#DADCE0]/50">
                        {filteredProjects.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-xs italic">
                                No projects found.
                                <br />
                                <button onClick={openImportModal} className="mt-2 text-[#1A73E8] underline hover:text-[#1557B0]">Import from GitHub?</button>
                            </div>
                        ) : (
                            filteredProjects.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => {
                                        handleSelect(p);
                                        setSearchParams({ edit: p.id });
                                    }}
                                    className={`mx-4 mb-3 p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${selectedProject?.id === p.id
                                        ? 'bg-[#E8F0FE] border-[#1A73E8] shadow-sm'
                                        : 'bg-white border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`font-medium text-base ${selectedProject?.id === p.id ? 'text-[#1967D2]' : 'text-[#202124]'}`}>
                                            {p.title}
                                        </h4>
                                        <div className="flex gap-1.5 shrink-0 mt-1">
                                            <div className={`size-2 rounded-full ${p.isLive ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} title={p.isLive ? "Live" : "Offline"} />
                                            {p.isVisible && <span className="material-symbols-outlined text-[10px] text-[#1A73E8]">visibility</span>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#5F6368] line-clamp-2 mb-3 bg-opacity-50">{p.description}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="text-[10px] font-bold text-[#5F6368] bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{p.category}</span>
                                        {(Array.isArray(p.skills) ? p.skills : []).slice(0, 3).map(s => (
                                            <span key={s} className="text-[10px] text-[#1967D2] bg-[#E8F0FE] px-2 py-0.5 rounded border border-[#D2E3FC]">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Mobile FAB for Create */}
                <button
                    onClick={handleCreateNew}
                    className="md:hidden absolute bottom-6 right-6 z-20 size-14 bg-[#1A73E8] text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#1557B0] active:scale-90 transition-all"
                >
                    <span className="material-symbols-outlined text-2xl">add</span>
                </button>
            </div>


            {/* Right: Editor */}
            {/* Logic: Hidden on mobile IF nothing selected */}
            <div className={`flex-1 flex flex-col bg-white overflow-y-auto ${(!selectedProject && !isCreating) ? "hidden md:flex" : "flex fixed top-16 left-0 right-0 bottom-0 z-30 md:static md:z-auto"
                }`}>
                {(selectedProject || isCreating) ? (
                    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
                        {/* Toolbar */}
                        <div className="h-16 border-b border-[#DADCE0] flex items-center justify-between px-4 md:px-8 bg-white shrink-0 sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                {/* Mobile Back Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedProject(null);
                                        setIsCreating(false);
                                        setSearchParams({});
                                    }}
                                    className="md:hidden mr-1 p-2 rounded-full hover:bg-gray-100 -ml-3 text-gray-600"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div>
                                    <h3 className="text-lg font-normal text-[#202124]">
                                        {isCreating ? "New Project" : "Edit Project"}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {isCreating ? "Showcase your work." : `ID: ${selectedProject?.id}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Toolbar Actions */}
                                <div className="hidden md:flex items-center gap-2">


                                    {!isCreating && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="hidden md:block text-[#D93025] hover:bg-[#FCE8E6] p-2 rounded-full transition-colors mr-2"
                                            title="Delete Project"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        className={`bg-[#1A73E8] text-white px-6 py-2 rounded shadow-sm text-sm font-medium hover:shadow hover:bg-[#1557B0] transition-all`}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6 md:space-y-8 animate-fade-in-up">
                            {/* Title Input */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-[#3C4043]">Project Title</label>
                                <TitleInput
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Project Title"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Description */}
                            <div className="bg-[#F8F9FA] p-4 md:p-6 rounded-lg border border-[#DADCE0]/50 space-y-4">
                                <h4 className="text-sm font-bold text-[#5F6368] mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">description</span>
                                    Overview
                                </h4>
                                <TextArea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your project, the problem it solves, and the technologies used..."
                                />
                            </div>

                            {/* Technical Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <Select
                                        label="Category"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        options={formCategories.map(c => ({ value: c, label: c }))}
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-xs font-bold text-[#5F6368] uppercase mb-2">Tech Stack / Skills</label>
                                    <div className="border border-[#DADCE0] rounded-md p-2 bg-white min-h-[42px] flex flex-wrap gap-2">
                                        {(Array.isArray(formData.skills) ? formData.skills : []).map(skill => (
                                            <span key={skill} className="bg-[#E8F0FE] text-[#1967D2] px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                                                {skill}
                                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-[#D93025] flex items-center">
                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            className="flex-1 min-w-[120px] text-sm text-[#3C4043] outline-none placeholder-gray-400 bg-transparent"
                                            value={skillSearch}
                                            onChange={e => {
                                                setSkillSearch(e.target.value);
                                                setShowSkillDropdown(true);
                                            }}
                                            onFocus={() => setShowSkillDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                                            placeholder="Type to add..."
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && skillSearch) {
                                                    e.preventDefault();
                                                    handleAddSkill(skillSearch);
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Skills Dropdown */}
                                    {showSkillDropdown && skillSearch && (
                                        <div className="absolute z-20 w-full bg-white border border-[#DADCE0] rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                                            {skills
                                                .filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()) && !formData.skills?.includes(s.name))
                                                .map(s => (
                                                    <div
                                                        key={s.id}
                                                        className="px-4 py-2 text-sm text-[#202124] hover:bg-[#F1F3F4] cursor-pointer flex items-center gap-2"
                                                        onMouseDown={() => handleAddSkill(s.name)}
                                                    >
                                                        <span className="material-symbols-outlined text-base text-[#5F6368]">{s.icon || "code"}</span>
                                                        {s.name}
                                                    </div>
                                                ))
                                            }
                                            {!skills.some(s => s.name.toLowerCase() === skillSearch.toLowerCase()) && (
                                                <div
                                                    className="px-4 py-2 text-sm text-[#1A73E8] hover:bg-[#E8F0FE] cursor-pointer font-medium flex items-center gap-2"
                                                    onMouseDown={() => handleAddSkill(skillSearch)}
                                                >
                                                    <span className="material-symbols-outlined text-base">add</span>
                                                    Create "{skillSearch}"
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Links Grid */}
                            <h4 className="border-b border-[#DADCE0] pb-2 text-sm font-medium text-[#202124] mt-8">Deployment & Source</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <Input
                                        label="Live Demo URL"
                                        icon="public"
                                        value={formData.liveUrl || ""}
                                        onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                                        placeholder="https://myproject.com"
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="GitHub Repo URL"
                                        icon="code"
                                        value={formData.githubUrl || ""}
                                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            {/* Assets */}
                            <h4 className="border-b border-[#DADCE0] pb-2 text-sm font-medium text-[#202124] mt-8">Assets</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <ImageUploader
                                        label="Project Image"
                                        value={formData.image || ""}
                                        onChange={(url: string) => setFormData({ ...formData, image: url })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#5F6368] uppercase mb-2">Readme.md (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer bg-white border border-[#DADCE0] hover:bg-[#F1F3F4] px-3 py-1.5 rounded-md text-xs font-medium text-[#3C4043] transition-colors">
                                            Upload Markdown
                                            <input
                                                type="file"
                                                accept=".md,.txt"
                                                onChange={handleReadmeUpload}
                                                className="hidden"
                                            />
                                        </label>
                                        {formData.readme && (
                                            <div className="flex items-center gap-2 text-xs text-[#188038] bg-[#E6F4EA] px-2 py-1 rounded">
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                Readme Loaded
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Project Status & Actions */}
                            <h4 className="border-b border-[#DADCE0] pb-2 text-sm font-medium text-[#202124] mt-8">Project Settings</h4>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between p-3 border border-[#DADCE0] rounded-lg bg-white">
                                    <div>
                                        <h5 className="text-sm font-medium text-[#202124]">Visibility</h5>
                                        <p className="text-xs text-[#5F6368]">Show this project on your public portfolio</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isVisible ? 'bg-[#1A73E8]' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 border border-[#DADCE0] rounded-lg bg-white">
                                    <div>
                                        <h5 className="text-sm font-medium text-[#202124]">Live Status</h5>
                                        <p className="text-xs text-[#5F6368]">Mark project as currently live/deployed</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isLive: !prev.isLive }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isLive ? 'bg-[#188038]' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isLive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                {!isCreating && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 text-[#D93025] border border-[#D93025] rounded-lg font-medium hover:bg-[#FCE8E6] transition-colors"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                        Delete Project
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F8F9FA]/50">
                        <div className="size-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-[#DADCE0]">
                            <span className="material-symbols-outlined text-5xl text-[#1A73E8]">dataset</span>
                        </div>
                        <h3 className="text-xl font-medium text-[#202124] mb-2">Select a Project</h3>
                        <p className="text-gray-500 max-w-xs mb-8">
                            manage your portfolio projects, details, and deployments.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateNew}
                                className="flex items-center gap-2 px-6 py-3 bg-[#1A73E8] text-white rounded-full font-medium hover:bg-[#1557B0] hover:shadow-lg transition-all"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Create New Project
                            </button>
                            <button
                                onClick={openImportModal}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-[#1A73E8] border border-[#DADCE0] rounded-full font-medium hover:bg-gray-50 hover:shadow-md transition-all"
                            >
                                <span className="material-symbols-outlined">cloud_download</span>
                                Import from GitHub
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .mask-fade { -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%); }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
            `}</style>
        </div >
    );
}
