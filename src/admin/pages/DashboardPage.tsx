import { Link } from "react-router-dom";
import React, { useState } from "react";
import { usePortfolio } from "../../shared/context/PortfolioContext";
import { GoogleSheetsService } from "../../shared/services/googleSheets";

export default function DashboardPage() {
    const { projects, skills, achievements, resumes, messages } = usePortfolio();

    // Stats Configuration
    const stats = [
        { label: "Projects", value: projects.length, subtext: `${projects.filter(p => p.isVisible).length} Visible`, icon: "rocket_launch", color: "text-[#1A73E8]" },
        { label: "Skills", value: skills.length, subtext: `${skills.length} Total`, icon: "code_blocks", color: "text-[#E37400]" },
        { label: "Achievements", value: achievements.filter(a => a.isVisible).length, subtext: `${achievements.length} Total Entries`, icon: "emoji_events", color: "text-[#188038]" },
        { label: "Resumes", value: resumes.length, subtext: `${resumes.find((r: any) => r.isActive)?.name || "None"} Active`, icon: "description", color: "text-[#EA4335]" },
        { label: "Messages", value: messages.length, subtext: `${messages.filter((m: any) => m.status === 'Unread').length} Unread`, icon: "mail", color: "text-[#9334E6]" },
    ];
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [isChangingPass, setIsChangingPass] = useState(false);



    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChangingPass(true);
        // Using generic request for admin action
        const result = await GoogleSheetsService.request<{ message: string }>({
            action: "CHANGE_PASSWORD",
            data: { newPassword }
        });
        setIsChangingPass(false);

        if (result.success) {
            alert("Password updated successfully.");
            setShowPasswordModal(false);
            setNewPassword("");
        } else {
            alert("Failed to update password: " + result.message);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto px-4 md:px-8 pb-8">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-light text-[#202124]">Dashboard</h1>
                        <p className="text-sm text-[#5F6368]">Welcome to your portfolio command center.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DADCE0] text-[#3C4043] font-medium rounded hover:bg-gray-50 transition-colors w-full md:w-auto justify-center"
                        >
                            <span className="material-symbols-outlined text-lg">lock_reset</span>
                            Change Password
                        </button>
                        {/* Logout is usually in Sidebar/Header, but keeping duplicate here is fine or removing if redundant */}
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200">
                        <h2 className="text-lg font-medium text-[#202124] mb-4">Change Admin Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#5F6368] uppercase mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full border border-[#DADCE0] rounded px-3 py-2 text-sm focus:border-[#1A73E8] outline-none"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Enter new secure password"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-[#5F6368] hover:text-[#202124]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChangingPass}
                                    className="px-4 py-2 bg-[#1A73E8] text-white text-sm font-medium rounded hover:bg-[#1557B0] disabled:opacity-50"
                                >
                                    {isChangingPass ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats Cards - Google Analytics Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-[#DADCE0] rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-[#5F6368]">{stat.label}</h3>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-normal text-[#202124]">{stat.value}</span>
                                </div>
                                <p className="text-xs text-[#5F6368] mt-4 font-medium">
                                    {stat.subtext}
                                </p>
                            </div>
                            <div className={`p - 2 rounded - full bg - opacity - 10 ${stat.color} bg - current`}>
                                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Suggestions */}
            <h3 className="text-lg font-normal text-[#202124] mt-4">Suggested actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#DADCE0] rounded-lg p-6 bg-white flex items-start justify-between group cursor-pointer hover:border-[#1A73E8] transition-colors">
                    <div>
                        <h4 className="text-base font-medium text-[#202124] group-hover:text-[#1A73E8]">Update Content</h4>
                        <p className="text-sm text-[#5F6368] mt-1 max-w-sm">Keep your bio and headline fresh. Review your current introduction text.</p>
                    </div>
                    <Link to="/admin/content" className="size-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1967D2]">
                        <span className="material-symbols-outlined">edit</span>
                    </Link>
                </div>

                <div className="border border-[#DADCE0] rounded-lg p-6 bg-white flex items-start justify-between group cursor-pointer hover:border-[#1A73E8] transition-colors">
                    <div>
                        <h4 className="text-base font-medium text-[#202124] group-hover:text-[#1A73E8]">Manage Projects</h4>
                        <p className="text-sm text-[#5F6368] mt-1 max-w-sm">Add your latest work or organize existing projects into categories.</p>
                    </div>
                    <Link to="/admin/projects" className="size-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1967D2]">
                        <span className="material-symbols-outlined">folder_open</span>
                    </Link>
                </div>

                <div className="border border-[#DADCE0] rounded-lg p-6 bg-white flex items-start justify-between group cursor-pointer hover:border-[#1A73E8] transition-colors">
                    <div>
                        <h4 className="text-base font-medium text-[#202124] group-hover:text-[#1A73E8]">Messages</h4>
                        <p className="text-sm text-[#5F6368] mt-1 max-w-sm">View and manage inquiries from your contact form.</p>
                    </div>
                    <Link to="/admin/messages" className="size-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1967D2]">
                        <span className="material-symbols-outlined">mail</span>
                    </Link>
                </div>
            </div>

            {/* System Status - Clean Banner */}
            <div className="mt-4 bg-[#E6F4EA] border border-none rounded-md p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#137333]">check_circle</span>
                <div>
                    <p className="text-sm font-medium text-[#137333]">System Healthy</p>
                    <p className="text-xs text-[#0D652D]">Google Sheets backend is connected and syncing.</p>
                </div>
            </div>
        </div>
    );
}
