import { Link } from "react-router-dom";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { usePortfolio, Skill } from "../../shared/context/PortfolioContext";
import { skillSchema } from "../../shared/utils/validationSchemas";
import { Input, Select, TitleInput } from "../components/ui/Inputs";
import type { z } from "zod";

type SkillFormData = z.infer<typeof skillSchema>;

export default function SkillsPage() {
    const { skills, projects, isLoading, addSkill, updateSkill, deleteSkill } = usePortfolio();

    const skillsList = skills || [];
    const projectsList = projects || [];

    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Core", "Frontend", "Backend", "Tools", "Design", "DevOps", "Other"];
    const formCategories = categories.filter(c => c !== "All");

    // React Hook Form with Zod validation
    const { register, handleSubmit: handleFormSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<SkillFormData>({
        resolver: zodResolver(skillSchema),
        defaultValues: {
            name: "",
            category: "Core",
            isVisible: true,
            icon: ""
        }
    });

    const formData = watch();

    // Derived Data
    const filteredSkills = useMemo(() => {
        let result = skillsList;

        if (activeCategory !== "All") {
            result = result.filter(s => s.category === activeCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query)
            );
        }

        return result.sort((a, b) => a.name.localeCompare(b.name));
    }, [skillsList, activeCategory, searchQuery]);

    // Calculate Usage (Case Insensitive)
    const getSkillUsage = (skillName: string) => {
        if (!skillName) return 0;
        return projectsList.filter(p =>
            p && p.skills && Array.isArray(p.skills) && p.skills.some(s => String(s).toLowerCase() === String(skillName).toLowerCase())
        ).length;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="size-10 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleSelect = (skill: Skill) => {
        setIsCreating(false);
        setSelectedSkill(skill);
        reset(skill);
    };

    const handleCreateNew = () => {
        setSelectedSkill(null);
        setIsCreating(true);
        reset({ name: "", category: "Core", isVisible: true, icon: "" });
    };

    const onSubmit = async (data: SkillFormData) => {
        try {
            if (isCreating) {
                await addSkill(data as Skill);
                setIsCreating(false);
                reset();
            } else if (selectedSkill) {
                await updateSkill(selectedSkill.id, data);
                setSelectedSkill({ ...selectedSkill, ...data } as Skill);
            }
        } catch (error) {
            console.error("Failed to save skill", error);
        }
    };

    const handleDelete = async () => {
        if (!selectedSkill) return;
        const usageCount = getSkillUsage(selectedSkill.name);
        const warning = usageCount > 0
            ? `⚠️ Warning: This skill is used in ${usageCount} projects.\n\nDeleting it will remove it from your Library, but it may still appear as text tags in projects.\n\nAre you sure you want to delete "${selectedSkill.name}"?`
            : `Delete "${selectedSkill.name}"?`;

        if (window.confirm(warning)) {
            await deleteSkill(selectedSkill.id);
            setSelectedSkill(null);
            setIsCreating(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] gap-0 bg-white md:border border-[#DADCE0] md:rounded-lg shadow-sm overflow-hidden relative">
            {/* Left Sidebar */}
            <div className={`w-full md:w-[350px] flex flex-col border-r border-[#DADCE0] bg-gray-50 ${(selectedSkill || isCreating) ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b border-[#DADCE0] space-y-3 bg-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider">Skills Library</h2>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{skillsList.length}</span>
                    </div>
                    <div className="relative">
                        <Input
                            placeholder="Search skills..."
                            icon="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
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

                <button
                    onClick={handleCreateNew}
                    className="hidden md:flex mx-4 mt-3 mb-2 items-center justify-center gap-2 py-2 border border-dashed border-[#DADCE0] rounded-lg text-[#1A73E8] text-sm font-medium hover:bg-[#F8F9FA] transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Create New Skill
                </button>

                <div className="flex-1 overflow-y-auto w-full pb-24">
                    {filteredSkills.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No skills found.</div>
                    ) : (
                        <div className="divide-y divide-[#DADCE0]/50">
                            {activeCategory === "All" && !searchQuery ? (
                                formCategories.map(cat => {
                                    const catSkills = filteredSkills.filter(s => s.category === cat);
                                    if (catSkills.length === 0) return null;
                                    return (
                                        <div key={cat}>
                                            <div className="px-4 py-2 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-[#DADCE0]/50 text-xs font-bold text-[#5F6368] uppercase tracking-wider flex justify-between items-center">
                                                {cat}
                                                <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 rounded-full">{catSkills.length}</span>
                                            </div>
                                            {catSkills.map(skill => (
                                                <SkillListItem
                                                    key={skill.id}
                                                    skill={skill}
                                                    isSelected={selectedSkill?.id === skill.id}
                                                    onSelect={() => handleSelect(skill)}
                                                    usage={getSkillUsage(skill.name)}
                                                />
                                            ))}
                                        </div>
                                    );
                                })
                            ) : (
                                filteredSkills.map(skill => (
                                    <SkillListItem
                                        key={skill.id}
                                        skill={skill}
                                        isSelected={selectedSkill?.id === skill.id}
                                        onSelect={() => handleSelect(skill)}
                                        usage={getSkillUsage(skill.name)}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleCreateNew}
                    className="md:hidden absolute bottom-6 right-6 z-20 size-14 bg-[#1A73E8] text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#1557B0] active:scale-90 transition-all"
                >
                    <span className="material-symbols-outlined text-2xl">add</span>
                </button>
            </div>

            {/* Right Panel: Editor */}
            <div className={`flex-1 flex flex-col bg-white overflow-y-auto ${(!selectedSkill && !isCreating) ? "hidden md:flex" : "flex fixed top-16 left-0 right-0 bottom-0 z-30 md:static md:z-auto"}`}>
                {(selectedSkill || isCreating) ? (
                    <form onSubmit={handleFormSubmit(onSubmit)} className="flex flex-col h-full bg-white">
                        <div className="h-16 border-b border-[#DADCE0] flex items-center justify-between px-4 md:px-8 bg-white shrink-0 sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedSkill(null);
                                        setIsCreating(false);
                                    }}
                                    className="md:hidden mr-1 p-2 rounded-full hover:bg-gray-100 -ml-3 text-gray-600"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div>
                                    <h3 className="text-lg font-normal text-[#202124]">
                                        {isCreating ? "Create New Skill" : "Edit Skill"}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {isCreating ? "Add a new technology to your stack." : `ID: ${selectedSkill?.id}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {!isCreating && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="hidden md:block text-[#D93025] hover:bg-[#FCE8E6] p-2 rounded-full transition-colors"
                                        title="Delete Skill"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#1A73E8] text-white px-6 py-2 rounded shadow-sm text-sm font-medium hover:shadow hover:bg-[#1557B0] transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6 md:space-y-8 animate-fade-in-up">
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-[#3C4043]">Skill Name</label>
                                <TitleInput
                                    {...register("name")}
                                    placeholder="e.g. React.js"
                                    autoFocus
                                />
                                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Select
                                        label="Category"
                                        {...register("category")}
                                        options={formCategories.map(c => ({ value: c, label: c }))}
                                    />
                                    {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
                                    <p className="text-[10px] text-gray-400 mt-1">Groups skills in your resume/portfolio.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-[#F8F9FA] rounded-lg border border-[#DADCE0]">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        {...register("isVisible")}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A73E8]"></div>
                                </label>
                                <div>
                                    <label htmlFor="toggle" className="block text-sm font-medium text-[#202124] cursor-pointer">Visible Publicly</label>
                                    <p className="text-xs text-gray-500">Enable to show this skill in your main portfolio list.</p>
                                </div>
                            </div>

                            {!isCreating && selectedSkill && (
                                <div className="pt-6 border-t border-[#DADCE0]">
                                    <h4 className="text-sm font-bold text-[#5F6368] mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">link</span>
                                        Associated Projects
                                    </h4>

                                    <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#DADCE0]/50">
                                        {projectsList.filter(p => (Array.isArray(p.skills) ? p.skills : []).some(s => s.toLowerCase() === selectedSkill.name.toLowerCase())).length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {projectsList
                                                    .filter(p => (Array.isArray(p.skills) ? p.skills : []).some(s => s.toLowerCase() === selectedSkill.name.toLowerCase()))
                                                    .map(p => (
                                                        <Link
                                                            key={p.id}
                                                            to="/admin/projects"
                                                            className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DADCE0] rounded-full text-xs font-medium text-[#3C4043] hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all shadow-sm"
                                                        >
                                                            {p.title}
                                                            <span className="material-symbols-outlined text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                                                        </Link>
                                                    ))
                                                }
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                                                <span className="material-symbols-outlined text-3xl mb-2 text-gray-300">link_off</span>
                                                <p className="text-xs">No projects are currently linked to this skill.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!isCreating && (
                                <div className="mt-8 border-t border-[#DADCE0] pt-6 md:hidden">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex items-center justify-center gap-2 w-full py-3 text-[#D93025] border border-[#D93025] rounded-lg font-medium hover:bg-[#FCE8E6] transition-colors"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                        Delete Skill
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F8F9FA]/50">
                        <div className="size-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-[#DADCE0]">
                            <span className="material-symbols-outlined text-5xl text-[#1A73E8]">auto_fix</span>
                        </div>
                        <h3 className="text-xl font-medium text-[#202124] mb-2">Select a Skill to Edit</h3>
                        <p className="text-gray-500 max-w-xs mb-8">
                            Choose a skill from the library on the left or create a new one to grow your portfolio.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 px-6 py-3 bg-[#1A73E8] text-white rounded-full font-medium hover:bg-[#1557B0] hover:shadow-lg transition-all"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Create New Skill
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .mask-fade { -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%); }
            `}</style>
        </div>
    );
}

const SkillListItem = memo(({ skill, isSelected, onSelect, usage }: {
    skill: Skill;
    isSelected: boolean;
    onSelect: () => void;
    usage: number;
}) => (
    <div
        onClick={onSelect}
        className={`mx-4 mb-3 p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${isSelected
            ? "bg-[#E8F0FE] border-[#1A73E8] shadow-sm"
            : "bg-white border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-md"
            }`}
    >
        <div className="flex items-center gap-4">
            <div className={`size-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${isSelected ? "bg-white text-[#1967D2]" : "bg-gray-50 text-gray-500 border border-gray-100"}`}>
                <span className="material-symbols-outlined">{skill.icon || "code"}</span>
            </div>
            <div>
                <h4 className={`font-medium text-base mb-0.5 ${isSelected ? "text-[#1967D2]" : "text-[#202124]"}`}>{skill.name}</h4>
            </div>
        </div>

        <div className="flex items-center gap-2">
            {usage > 0 && (
                <span className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-bold" title={`${usage} Projects`}>
                    {usage}
                </span>
            )}
            <div className={`size-2 rounded-full ${skill.isVisible ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]" : "bg-gray-300"}`} title={skill.isVisible ? "Visible" : "Hidden"} />
        </div>
    </div>
));

SkillListItem.displayName = 'SkillListItem';
