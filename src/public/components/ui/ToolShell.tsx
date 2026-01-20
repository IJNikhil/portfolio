import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { LayoutDashboard, FolderKanban, Award, BookOpen, Settings, LogOut, Code2, User } from "lucide-react";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    to: string;
    isActive?: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, isActive }: SidebarItemProps) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border",
            isActive
                ? "bg-primary/5 border-primary/20 text-primary shadow-sm"
                : "border-transparent text-text-muted hover:bg-white hover:border-border hover:shadow-sm hover:text-text-main"
        )}
    >
        <Icon className={clsx("w-5 h-5", isActive ? "text-primary" : "text-text-muted group-hover:text-primary transition-colors")} />
        <span className="font-medium text-sm tracking-wide">{label}</span>
    </Link>
);

const UserProfile = () => (
    <div className="flex items-center gap-3 px-4 py-3 mt-auto border-t border-border/50 pt-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-0.5">
            <div className="w-full h-full rounded-full bg-surface border-2 border-white flex items-center justify-center overflow-hidden">
                <img src="/assets/hero-avatar.png" alt="User" className="w-full h-full object-cover" />
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-main truncate">Nikhil Adam</p>
            <p className="text-xs text-text-muted truncate">Admin Workspace</p>
        </div>
    </div>
);

export default function ToolShell({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");

    const menuItems = isAdmin
        ? [
            { icon: LayoutDashboard, label: "Dashboard", to: "/admin/dashboard" },
            { icon: FolderKanban, label: "Manage Projects", to: "/admin/projects" },
            { icon: Settings, label: "Settings", to: "/admin/settings" },
        ]
        : [
            { icon: User, label: "About", to: "/" },
            { icon: Code2, label: "Projects", to: "/projects/all" },
            { icon: Award, label: "Achievements", to: "/achievements/all" },
            { icon: BookOpen, label: "Blog", to: "/blog" }, // Placeholder
        ];

    return (
        <div className="flex w-full h-screen bg-background text-text-main overflow-hidden font-sans bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20">
            {/* Sidebar */}
            <aside className="w-[320px] h-full flex flex-col border-r border-border/60 bg-surface/50 backdrop-blur-xl p-6 z-20 shadow-xl shadow-black/5">
                {/* Logo Area */}
                <div className="mb-10 px-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-glow">
                        N
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-text-main">
                        Portfolio<span className="text-primary">.dev</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    <div className="px-2 mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted/60">
                        {isAdmin ? "Management" : "Explore"}
                    </div>
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            icon={item.icon}
                            label={item.label}
                            to={item.to}
                            isActive={location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to))}
                        />
                    ))}
                </nav>

                {/* User Profile (Bottom) */}
                <UserProfile />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden flex flex-col bg-glass-gradient">
                <div className="flex-1 overflow-y-auto scrollbar-custom p-8 relative">
                    <div className="max-w-6xl mx-auto pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
