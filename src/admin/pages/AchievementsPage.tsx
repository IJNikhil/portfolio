import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { usePortfolio, Achievement } from "../../shared/context/PortfolioContext";
import { achievementSchema } from "../../shared/utils/validationSchemas";
import { ImageUploader } from "../components/ui/ImageUploader";
import { Input, TextArea, Select, TitleInput } from "../components/ui/Inputs";
import type { z } from "zod";

type AchievementFormData = z.infer<typeof achievementSchema>;

export default function AchievementsPage() {
    const { achievements, addAchievement, updateAchievement, deleteAchievement } = usePortfolio();

    const [selectedAch, setSelectedAch] = useState<Achievement | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Certificate", "Award", "Hackathon", "Achievement", "Conference", "Other"];
    const formCategories = categories.filter(c => c !== "All");

    // React Hook Form with Zod validation
    const { register, handleSubmit: handleFormSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<AchievementFormData>({
        resolver: zodResolver(achievementSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date().getFullYear().toString(),
            category: "Certificate",
            image: "",
            proofUrl: "",
            isVisible: true
        }
    });

    const formData = watch();

    // Filtering Logic
    const filteredAchievements = useMemo(() => {
        let result = achievements;

        if (activeCategory !== "All") {
            result = result.filter(a => a.category === activeCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a =>
                a.title.toLowerCase().includes(q) ||
                a.description.toLowerCase().includes(q)
            );
        }

        return result;
    }, [achievements, activeCategory, searchQuery]);

    const handleSelect = (ach: Achievement) => {
        setIsCreating(false);
        setSelectedAch(ach);
        reset(ach);
    };

    const handleCreateNew = () => {
        setSelectedAch(null);
        setIsCreating(true);
        reset({
            title: "",
            description: "",
            date: new Date().getFullYear().toString(),
            category: "Certificate",
            image: "",
            proofUrl: "",
            isVisible: true
        });
    };

    const onSubmit = async (data: AchievementFormData) => {
        try {
            if (isCreating) {
                await addAchievement(data as Achievement);
                setIsCreating(false);
                reset();
            } else if (selectedAch) {
                await updateAchievement(selectedAch.id, data);
            }
        } catch (error) {
            console.error("Failed to save achievement", error);
        }
    };

    const handleDelete = async () => {
        if (selectedAch && window.confirm(`Delete "${selectedAch.title}"?`)) {
            await deleteAchievement(selectedAch.id);
            setSelectedAch(null);
            setIsCreating(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] gap-0 bg-white md:border border-[#DADCE0] md:rounded-lg shadow-sm overflow-hidden relative">
            {/* Left Sidebar: List & filters */}
            <div className={`w-full md:w-[350px] flex flex-col border-r border-[#DADCE0] bg-gray-50 ${(selectedAch || isCreating) ? "hidden md:flex" : "flex"
                }`}>
                {/* Search Header */}
                <div className="p-4 border-b border-[#DADCE0] space-y-3 bg-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-bold text-[#5F6368] uppercase tracking-wider">Achievements</h2>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{achievements.length}</span>
                    </div>
                    <div className="relative">
                        <Input
                            placeholder="Search achievements..."
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
                        <span className="material-symbols-outlined text-lg">emoji_events</span>
                        Add New Achievement
                    </button>

                    <div className="divide-y divide-[#DADCE0]/50">
                        {filteredAchievements.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-xs italic">No items match your filter.</div>
                        ) : (
                            filteredAchievements.map(ach => (
                                <AchievementListItem
                                    key={ach.id}
                                    achievement={ach}
                                    isSelected={selectedAch?.id === ach.id}
                                    onSelect={() => handleSelect(ach)}
                                />
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
            <div className={`flex-1 flex flex-col bg-white overflow-y-auto ${(!selectedAch && !isCreating) ? "hidden md:flex" : "flex fixed top-16 left-0 right-0 bottom-0 z-30 md:static md:z-auto"
                }`}>
                {(selectedAch || isCreating) ? (
                    <form onSubmit={handleFormSubmit(onSubmit)} className="flex flex-col h-full bg-white">
                        <div className="h-16 border-b border-[#DADCE0] flex items-center justify-between px-4 md:px-8 bg-white shrink-0 sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                {/* Mobile Back Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedAch(null);
                                        setIsCreating(false);
                                    }}
                                    className="md:hidden mr-1 p-2 rounded-full hover:bg-gray-100 -ml-3 text-gray-600"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div>
                                    <h3 className="text-lg font-normal text-[#202124]">
                                        {isCreating ? "New Achievement" : "Edit Details"}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {isCreating ? "Celebrate your wins." : `ID: ${selectedAch?.id}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isCreating && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="hidden md:block text-[#D93025] hover:bg-[#FCE8E6] p-2 rounded-full transition-colors"
                                        title="Delete Achievement"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`bg-[#1A73E8] text-white px-6 py-2 rounded shadow-sm text-sm font-medium hover:shadow hover:bg-[#1557B0] transition-all disabled:opacity-50`}
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>

                        <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6 md:space-y-8 animate-fade-in-up">
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-[#3C4043]">Achievement Title</label>
                                <TitleInput
                                    {...register("title")}
                                    placeholder="e.g. AWS Certified Solutions Architect"
                                    autoFocus
                                />
                                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <Select
                                        label="Category"
                                        {...register("category")}
                                        options={formCategories.map(c => ({ value: c, label: c }))}
                                    />
                                    {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
                                </div>
                                <div>
                                    <Input
                                        label="Date / Year"
                                        {...register("date")}
                                        placeholder="e.g. Dec 2024"
                                    />
                                    {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
                                </div>
                            </div>

                            <div className="bg-[#F8F9FA] p-4 md:p-6 rounded-lg border border-[#DADCE0]/50 space-y-4">
                                <h4 className="text-sm font-bold text-[#5F6368] mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">description</span>
                                    Details
                                </h4>
                                <TextArea
                                    {...register("description")}
                                    placeholder="Describe why this is significant..."
                                    className="min-h-[100px]"
                                />
                                {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div>
                                    <Input
                                        label="Proof / Credential Link"
                                        icon="link"
                                        {...register("proofUrl")}
                                        placeholder="https://credly.com/..."
                                    />
                                    {errors.proofUrl && <p className="text-xs text-red-600 mt-1">{errors.proofUrl.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#5F6368] uppercase mb-2">Proof Image / Badge</label>
                                    <ImageUploader
                                        label="Proof Image / Badge"
                                        value={formData.image || ""}
                                        onChange={(url: string) => setValue("image", url)}
                                        folder="Achievements"
                                    />
                                    {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image.message}</p>}
                                </div>
                            </div>

                            {/* Visibility Toggle */}
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
                                    <p className="text-xs text-gray-500">Enable to show this achievement in your portfolio.</p>
                                </div>
                            </div>

                            {/* Mobile Delete Button */}
                            {!isCreating && (
                                <div className="md:hidden mt-4 pt-6 border-t border-[#DADCE0]">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex items-center justify-center gap-2 w-full py-3 text-[#D93025] border border-[#D93025] rounded-lg font-medium hover:bg-[#FCE8E6] transition-colors"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                        Delete Achievement
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F8F9FA]/50">
                        <div className="size-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-[#DADCE0]">
                            <span className="material-symbols-outlined text-5xl text-[#F9AB00]">emoji_events</span>
                        </div>
                        <h3 className="text-xl font-medium text-[#202124] mb-2">Select an Achievement</h3>
                        <p className="text-gray-500 max-w-xs mb-8">
                            Showcase your certifications, awards, and hackathon wins.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 px-6 py-3 bg-[#1A73E8] text-white rounded-full font-medium hover:bg-[#1557B0] hover:shadow-lg transition-all"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add New Achievement
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

// Memoized list item component
const AchievementListItem = memo(({ achievement, isSelected, onSelect }: {
    achievement: Achievement;
    isSelected: boolean;
    onSelect: () => void;
}) => (
    <div
        onClick={onSelect}
        className={`mx-4 mb-3 p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${isSelected
            ? 'bg-[#E8F0FE] border-[#1A73E8] shadow-sm'
            : 'bg-white border-[#DADCE0] hover:border-[#1A73E8] hover:shadow-md'
            }`}
    >
        <div className="flex items-center gap-3">
            <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-white' : 'bg-gray-50 border border-gray-100'}`}>
                <span className={`material-symbols-outlined text-xl ${achievement.category === 'Certificate' ? 'text-[#1A73E8]' : 'text-[#F9AB00]'}`}>
                    {achievement.category === 'Certificate' ? 'verified' : 'emoji_events'}
                </span>
            </div>
            <div>
                <h4 className={`font-medium text-base mb-0.5 ${isSelected ? 'text-[#1967D2]' : 'text-[#202124]'}`}>
                    {achievement.title}
                </h4>
                <p className="text-xs text-[#5F6368] flex items-center gap-1">
                    <span>{achievement.category}</span>
                    <span>•</span>
                    <span>{achievement.date}</span>
                </p>
            </div>
        </div>

        <div className={`absolute top-3 right-3 size-2 rounded-full ${achievement.isVisible ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} />
    </div>
));

AchievementListItem.displayName = 'AchievementListItem';
