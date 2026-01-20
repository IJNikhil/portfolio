import React, { useState, useEffect } from "react";
import { usePortfolio, HeroData } from "../../shared/context/PortfolioContext";
import { GoogleSheetsService } from "../../shared/services/googleSheets";
import { toast } from "sonner";
import { Input, TextArea } from "../components/ui/Inputs";


export default function ContentPage() {
    const { hero, resumes, projects, skills, achievements, settings, updateHero, addResume, deleteResume, setResumeActive, updateSettings } = usePortfolio();

    // Safety check / Loading state
    // Ideally usePortfolio handles loading, but hero might be null initially
    // Safety check / Loading state
    // Safety check / Loading state
    const safeHero: HeroData = {
        name: hero?.name || "",
        firstName: hero?.firstName || "",
        headline: hero?.headline || "",
        tagline: hero?.tagline || "",
        bio: hero?.bio || "",
        secondaryBio: hero?.secondaryBio || "",
        email: hero?.email || "",
        avatar: hero?.avatar || "",
        github: hero?.github || "",
        linkedin: hero?.linkedin || "",
        socials: hero?.socials || {},
        terminalGreeting: hero?.terminalGreeting || "",
        greeting: hero?.greeting || "",
        terminalStack: hero?.terminalStack || [],
        customLinks: hero?.customLinks || []
    };

    const [formData, setFormData] = useState<HeroData>(safeHero);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingResume, setIsUploadingResume] = useState(false);

    const [terminalStackInput, setTerminalStackInput] = useState("");

    useEffect(() => {
        if (hero) {
            setFormData({
                name: hero.name || "",
                firstName: hero.firstName || "",
                headline: hero.headline || "",
                tagline: hero.tagline || "",
                bio: hero.bio || "",
                secondaryBio: hero.secondaryBio || "",
                email: hero.email || "",
                avatar: hero.avatar || "",
                github: hero.github || "",
                linkedin: hero.linkedin || "",
                socials: hero.socials || {},
                terminalGreeting: hero.terminalGreeting || "",
                greeting: hero.greeting || "",
                terminalStack: hero.terminalStack || [],
                customLinks: hero.customLinks || []
            });
            setTerminalStackInput(hero.terminalStack?.join(", ") || "");
        }
    }, [hero]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const promise = (async () => {
            const finalData = {
                ...formData,
                terminalStack: terminalStackInput.split(",").map(s => s.trim()).filter(Boolean)
            };
            await updateHero(finalData);
        })();

        toast.promise(promise, {
            loading: 'Saving changes...',
            success: 'Content updated successfully!',
            error: 'Failed to update content',
        });

        try {
            await promise;
        } catch (e) { /* handled by toast */ }
        finally {
            setIsSaving(false);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploadingResume(true);
            try {
                // 1. Convert to Base64
                const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(f);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });

                const base64Full = await toBase64(file);
                const base64 = base64Full.split(',')[1];

                // 2. Upload to Drive via GAS
                const uploadResponse = await GoogleSheetsService.request<{ url: string }>({
                    action: "UPLOAD_FILE",
                    data: {
                        name: file.name,
                        mimeType: file.type,
                        base64: base64,
                        folder: "resumes"
                    }
                });

                if (!uploadResponse.success || !uploadResponse.data?.url) {
                    throw new Error("Upload failed");
                }

                // 3. Add Resume Entry
                const promise = addResume({
                    name: file.name,
                    url: uploadResponse.data.url,
                    isActive: false,
                    dateAdded: new Date().toISOString()
                });

                toast.promise(promise, {
                    loading: 'Saving resume...',
                    success: 'Resume uploaded successfully!',
                    error: 'Failed to save resume',
                });

                await promise;

            } catch (err) {
                console.error(err);
                toast.error("Failed to upload resume");
            } finally {
                setIsUploadingResume(false);
            }
        }
    };

    return (
        <div className="max-w-[720px] mx-auto pb-10 px-4">
            <div className="mb-6">
                <h2 className="text-2xl font-normal text-[#202124]">Content settings</h2>
                <p className="text-[#5F6368] text-sm mt-1">Manage public profile information.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Intro Card */}
                <div className="bg-white border border-[#DADCE0] rounded-lg p-6 shadow-sm">
                    <h3 className="text-base font-medium text-[#202124] mb-4">Introduction</h3>

                    <div className="space-y-6">
                        <Input
                            label="Greeting"
                            value={formData.greeting || "Hi, I'm"}
                            onChange={e => setFormData({ ...formData, greeting: e.target.value })}
                        />

                        <Input
                            label="Headline / Name"
                            value={formData.headline || ""}
                            onChange={e => setFormData({ ...formData, headline: e.target.value })}
                        />

                        <Input
                            label="Tagline (Big Text)"
                            value={formData.tagline || ""}
                            onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                        />

                        <TextArea
                            label="Main Bio (e.g. Education/Role)"
                            value={formData.bio || ""}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            className="h-20"
                        />

                        <TextArea
                            label="Secondary Bio (e.g. Coffee/Fun)"
                            value={formData.secondaryBio || ""}
                            onChange={e => setFormData({ ...formData, secondaryBio: e.target.value })}
                            className="h-16"
                        />
                    </div>
                </div>

                {/* Integration & Terminal Card */}
                <div className="bg-white border border-[#DADCE0] rounded-lg p-6 shadow-sm space-y-8">

                    {/* Primary Socials */}
                    <div>
                        <h3 className="text-base font-medium text-[#202124] mb-4">Primary Socials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="GitHub URL"
                                value={formData.github || ""}
                                onChange={e => setFormData({ ...formData, github: e.target.value })}
                            />
                            <Input
                                label="LinkedIn URL"
                                value={formData.linkedin || ""}
                                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Additional Links */}
                    <div className="border-t border-[#DADCE0] pt-6">
                        <h3 className="text-base font-medium text-[#202124] mb-4">Additional Links</h3>
                        <div className="space-y-3">
                            {formData.customLinks?.map((link, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-3 rounded-lg md:bg-transparent md:p-0">
                                    <Input
                                        className="w-full bg-white"
                                        containerClassName="w-full md:w-1/3"
                                        value={link.label}
                                        onChange={e => {
                                            const newLinks = [...(formData.customLinks || [])];
                                            newLinks[index].label = e.target.value;
                                            setFormData({ ...formData, customLinks: newLinks });
                                        }}
                                        placeholder="Platform (e.g. Twitter)"
                                    />
                                    <Input
                                        className="w-full bg-white"
                                        containerClassName="w-full md:flex-1"
                                        value={link.url}
                                        onChange={e => {
                                            const newLinks = [...(formData.customLinks || [])];
                                            newLinks[index].url = e.target.value;
                                            setFormData({ ...formData, customLinks: newLinks });
                                        }}
                                        placeholder="URL"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newLinks = formData.customLinks?.filter((_, i) => i !== index);
                                            setFormData({ ...formData, customLinks: newLinks });
                                        }}
                                        className="text-[#5F6368] hover:text-[#D93025] p-2 self-end md:self-center"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, customLinks: [...(formData.customLinks || []), { label: "", url: "" }] })}
                                className="text-sm text-[#1A73E8] font-medium flex items-center gap-1 mt-2 hover:bg-[#E8F0FE] px-3 py-1.5 rounded-full w-fit transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">add</span>
                                Add Link
                            </button>
                        </div>
                    </div>

                    {/* Terminal Config */}
                    <div className="border-t border-[#DADCE0] pt-6">
                        <h3 className="text-base font-medium text-[#202124] mb-4 font-mono">Terminal & Hero</h3>
                        <div className="space-y-6">
                            <Input
                                label="whoami"
                                value={formData.terminalGreeting || ""}
                                onChange={e => setFormData({ ...formData, terminalGreeting: e.target.value })}
                                className="font-mono"
                            />

                            <Input
                                label="locate --current-stack (Comma separated)"
                                value={terminalStackInput}
                                onChange={e => setTerminalStackInput(e.target.value)}
                                placeholder="Kubernetes, TypeScript, Rust"
                                className="font-mono"
                            />
                        </div>
                    </div>

                    {/* Resume Manager */}
                    <div className="border-t border-[#DADCE0] pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-medium text-[#202124]">Resume Management</h3>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    onChange={handleResumeUpload}
                                    disabled={isUploadingResume}
                                />
                                <button type="button" className={`text-xs bg-[#E8F0FE] text-[#1967D2] font-medium px-4 py-2 rounded-full hover:bg-[#D2E3FC] ${isUploadingResume ? 'opacity-50' : ''}`}>
                                    {isUploadingResume ? "Uploading..." : "+ Upload New Resume"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {resumes.length === 0 && (
                                <p className="text-sm text-[#5F6368] italic">No resumes uploaded yet.</p>
                            )}
                            {resumes.map(r => (
                                <div key={r.id} className={`flex items-center justify-between p-3 rounded border ${r.isActive ? 'bg-[#E6F4EA] border-green-200' : 'bg-white border-[#DADCE0]'}`}>
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div
                                            onClick={() => setResumeActive(r.id)}
                                            className={`size-5 rounded-full border cursor-pointer flex items-center justify-center ${r.isActive ? 'border-[#188038]' : 'border-[#5F6368]'}`}
                                        >
                                            {r.isActive && <div className="size-2.5 bg-[#188038] rounded-full"></div>}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <a href={r.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#202124] truncate hover:text-[#1A73E8]">{r.name}</a>
                                            <span className="text-[10px] text-[#5F6368]">{r.isActive ? "Active Public Resume" : "Stored in Library"}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => deleteResume(r.id)}
                                        className="text-[#5F6368] hover:text-[#D93025] p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Delete"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Visibility Settings --- */}
                <div className="bg-white border border-[#DADCE0] rounded-lg p-6 shadow-sm">
                    <h3 className="text-base font-medium text-[#202124] mb-4">Section Visibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Projects */}
                        <label className={`flex items-center gap-3 p-3 rounded-lg border ${projects.length > 0 ? 'border-[#DADCE0] cursor-pointer hover:bg-[#F1F3F4]' : 'border-[#F1F3F4] bg-[#F8F9FA] opacity-50 cursor-not-allowed'}`}>
                            <input
                                type="checkbox"
                                checked={settings?.showProjects}
                                onChange={(e) => updateSettings({ ...settings, showProjects: e.target.checked })}
                                disabled={projects.length === 0}
                                className="w-4 h-4 text-[#1A73E8] border-gray-300 rounded focus:ring-[#1A73E8]"
                            />
                            <div>
                                <span className="text-[#202124] text-sm font-medium block">Show Projects</span>
                                <span className="text-xs text-[#5F6368]">
                                    {projects.length === 0 ? "Add projects to enable" : `${projects.length} projects`}
                                </span>
                            </div>
                        </label>

                        {/* Skills */}
                        <label className={`flex items-center gap-3 p-3 rounded-lg border ${skills.length > 0 ? 'border-[#DADCE0] cursor-pointer hover:bg-[#F1F3F4]' : 'border-[#F1F3F4] bg-[#F8F9FA] opacity-50 cursor-not-allowed'}`}>
                            <input
                                type="checkbox"
                                checked={settings?.showSkills}
                                onChange={(e) => updateSettings({ ...settings, showSkills: e.target.checked })}
                                disabled={skills.length === 0}
                                className="w-4 h-4 text-[#1A73E8] border-gray-300 rounded focus:ring-[#1A73E8]"
                            />
                            <div>
                                <span className="text-[#202124] text-sm font-medium block">Show Skills</span>
                                <span className="text-xs text-[#5F6368]">
                                    {skills.length === 0 ? "Add skills to enable" : `${skills.length} skills`}
                                </span>
                            </div>
                        </label>

                        {/* Achievements */}
                        <label className={`flex items-center gap-3 p-3 rounded-lg border ${achievements.length > 0 ? 'border-[#DADCE0] cursor-pointer hover:bg-[#F1F3F4]' : 'border-[#F1F3F4] bg-[#F8F9FA] opacity-50 cursor-not-allowed'}`}>
                            <input
                                type="checkbox"
                                checked={settings?.showAchievements}
                                onChange={(e) => updateSettings({ ...settings, showAchievements: e.target.checked })}
                                disabled={achievements.length === 0}
                                className="w-4 h-4 text-[#1A73E8] border-gray-300 rounded focus:ring-[#1A73E8]"
                            />
                            <div>
                                <span className="text-[#202124] text-sm font-medium block">Show Achievements</span>
                                <span className="text-xs text-[#5F6368]">
                                    {achievements.length === 0 ? "Add achievements to enable" : `${achievements.length} achievements`}
                                </span>
                            </div>
                        </label>

                        {/* Contact */}
                        <label className={`flex items-center gap-3 p-3 rounded-lg border border-[#DADCE0] cursor-pointer hover:bg-[#F1F3F4]`}>
                            <input
                                type="checkbox"
                                checked={settings?.showContact}
                                onChange={(e) => updateSettings({ ...settings, showContact: e.target.checked })}
                                className="w-4 h-4 text-[#1A73E8] border-gray-300 rounded focus:ring-[#1A73E8]"
                            />
                            <div>
                                <span className="text-[#202124] text-sm font-medium block">Show Contact</span>
                                <span className="text-xs text-[#5F6368]">
                                    Enable public contact form (messages saved to Admin Inbox)
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center bg-[#E8F0FE] p-4 rounded-lg sticky bottom-4 shadow-md">
                    <span className="text-xs text-[#1967D2]">Changes autosave to context. Click Save to persist to Sheets.</span>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-[#1A73E8] text-white font-medium rounded text-sm hover:shadow-md transition-shadow disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </form>
        </div>
    );
}
