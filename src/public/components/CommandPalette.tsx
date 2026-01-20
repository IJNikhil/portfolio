import React, { useEffect, useState } from "react";
import { Search, Briefcase, Mail, FileText, Command as CommandIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Note: Reusing existing libraries found in dependencies if possible.
// If Command Package (cmdk) isn't installed, I'll build a custom simple one to avoid install overhead.

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const onKeydown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        window.addEventListener("keydown", onKeydown);
        return () => window.removeEventListener("keydown", onKeydown);
    }, []);

    const actions = [
        { name: "Projects", icon: Briefcase, action: () => navigate("/admin/projects"), shortcut: "P" },
        { name: "Skills", icon: CommandIcon, action: () => navigate("/admin/skills"), shortcut: "S" },
        { name: "Resume", icon: FileText, action: () => navigate("/admin/content"), shortcut: "R" },
        { name: "Contact", icon: Mail, action: () => navigate("/admin/messages"), shortcut: "C" },
    ];

    const filtered = actions.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 animate-fade-in-down">

                {/* Search Input */}
                <div className="flex items-center border-b px-3 h-14">
                    <Search className="mr-2 h-5 w-5 text-gray-500" />
                    <input
                        className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    <div className="text-xs text-gray-400 border px-1.5 py-0.5 rounded">ESC</div>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto p-2">
                    {filtered.length === 0 && (
                        <div className="py-14 text-center text-sm text-gray-500">No results found.</div>
                    )}

                    {filtered.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                item.action();
                                setIsOpen(false);
                            }}
                            className="flex w-full items-center rounded-lg px-3 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors group"
                        >
                            <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-900" />
                            <span className="flex-1 font-medium">{item.name}</span>
                            {item.shortcut && (
                                <span className="text-xs text-gray-400 font-mono border px-1 rounded bg-white">
                                    {item.shortcut}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-400 flex justify-between">
                    <span>Use ↑↓ to navigate</span>
                    <span>Enter to select</span>
                </div>
            </div>

            {/* Backdrop Click */}
            <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
        </div>
    );
};

export default CommandPalette;
