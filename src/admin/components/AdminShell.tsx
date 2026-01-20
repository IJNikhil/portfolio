import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { usePortfolio } from "../../shared/context/PortfolioContext";

interface AdminShellProps {
    children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { projects } = usePortfolio();
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { icon: "dashboard", label: "Dashboard", to: "/admin/dashboard" },
        { icon: "description", label: "Content", to: "/admin/content" },
        { icon: "folder_open", label: "Projects", to: "/admin/projects" },
        { icon: "code", label: "Skills", to: "/admin/skills" },
        { icon: "emoji_events", label: "Achievements", to: "/admin/achievements" },
        { icon: "mail", label: "Messages", to: "/admin/messages" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("admin_auth_token");
        navigate("/admin/login");
    }

    const filteredProjects = (projects || []).filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateClick = () => {
        navigate("/admin/projects?create=true");
        setIsSidebarOpen(false);
    }

    const handleNavClick = () => {
        setIsSidebarOpen(false);
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FA] font-sans text-[#202124]">
            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#DADCE0] flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2 w-64 pl-2">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 lg:hidden focus:outline-none"
                    >
                        <span className="material-symbols-outlined text-[#5F6368] text-2xl">menu</span>
                    </button>
                    <div className="flex items-center gap-2 ml-2">
                        <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
                        </div>
                        <span className="text-xl font-normal text-[#5F6368] hidden sm:block">Admin</span>
                    </div>
                </div>

                {/* Search Bar (Hidden on small mobile) */}
                <div className="flex-1 max-w-2xl px-4 hidden md:block relative">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-[#5F6368] group-focus-within:text-[#202124]">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects, skills, and more"
                            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg leading-5 bg-[#F1F3F4] text-[#3C4043] placeholder-[#5F6368] focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 focus:shadow-md transition-all sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowResults(true);
                            }}
                            onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        />
                    </div>
                    {/* Search Results Dropdown */}
                    {showResults && searchQuery && (
                        <div className="absolute top-12 left-4 right-4 bg-white rounded-lg shadow-lg border border-[#DADCE0] py-2 z-50 max-h-96 overflow-y-auto">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => navigate(`/admin/projects?edit=${p.id}`)}
                                        className="px-4 py-2 hover:bg-[#F1F3F4] cursor-pointer flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-[#5F6368]">folder</span>
                                        <div>
                                            <p className="text-sm font-medium text-[#202124]">{p.title}</p>
                                            <p className="text-xs text-[#5F6368]">{p.category}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-sm text-[#5F6368]">No matching projects found.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile / Actions */}
                <div className="flex items-center gap-1 sm:gap-3 pr-2">
                    <div className="ml-2 size-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium cursor-pointer hover:ring-4 ring-gray-100" title="Account">
                        N
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex pt-16 w-full relative">

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={clsx(
                    "w-64 bg-white flex flex-col justify-between py-4 overflow-y-auto border-r border-[#DADCE0] transition-transform duration-300 ease-in-out z-50 fixed lg:relative h-[calc(100vh-4rem)]",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}>
                    <nav className="px-2 space-y-1">
                        <div className="mb-6 px-4">
                            <button
                                onClick={handleCreateClick}
                                className="flex items-center gap-3 bg-white border border-[#DADCE0] hover:bg-[#F8F9FA] hover:shadow-md transition-all text-[#1A73E8] px-4 py-3 rounded-full shadow-sm w-fit min-w-[140px]"
                            >
                                <span className="material-symbols-outlined text-2xl">add</span>
                                <span className="font-medium">Create</span>
                            </button>
                        </div>

                        {navItems.map((item) => {
                            const isActive = location.pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={handleNavClick}
                                    className={clsx(
                                        "flex items-center gap-4 px-6 py-2 rounded-r-full text-sm font-medium transition-colors mr-2",
                                        isActive
                                            ? "bg-[#E8F0FE] text-[#1967D2]"
                                            : "text-[#3C4043] hover:bg-[#F1F3F4]"
                                    )}
                                >
                                    <span className={clsx("material-symbols-outlined text-xl", isActive ? "text-[#1967D2]" : "text-[#5F6368]")}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-4 border-t border-[#DADCE0] pt-4 mt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-6 py-2 rounded-r-full text-sm font-medium text-[#3C4043] hover:bg-[#F1F3F4] w-full"
                        >
                            <span className="material-symbols-outlined text-[#5F6368] text-xl">logout</span>
                            Sign out
                        </button>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-white lg:bg-[#F8F9FA] p-0 lg:p-8 relative w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
