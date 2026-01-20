import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../shared/services/authService";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // New: Authenticate via AuthService
            const result = await authService.login(password);

            if (result.success) {
                // Token is already stored by authService.login check inside
                navigate("/admin/dashboard");
            } else {
                setError(result.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError("Login failed. Check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] font-sans">
            <div className="w-full max-w-[450px] bg-white p-10 rounded-2xl shadow-sm border border-gray-200">

                <div className="flex flex-col items-center mb-10">
                    <div className="size-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
                        <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
                    </div>
                    <h1 className="text-2xl font-normal text-[#202124]">Sign in</h1>
                    <p className="text-[#5F6368] mt-2">to continue to Portfolio Admin</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`peer w-full border rounded-md px-3 pt-5 pb-2 text-base outline-none transition-colors 
                                ${error ? 'border-red-500 focus:border-red-600' : 'border-[#DADCE0] focus:border-blue-600 focus:ring-1 focus:ring-blue-600'}`}
                            placeholder=" "
                        />
                        <label className={`absolute left-3 top-2 text-xs text-[#5F6368] transition-all 
                                peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-[#80868B]
                                peer-focus:top-1 peer-focus:text-xs 
                                ${error ? 'peer-focus:text-red-600' : 'peer-focus:text-blue-600'}`}>
                            Enter your password
                        </label>
                        {error && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#1A73E8] text-white font-medium px-6 py-2 rounded-full hover:bg-[#1557B0] hover:shadow-md transition-all active:bg-[#174EA6] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Authenticating..." : "Next"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="absolute bottom-8 text-xs text-[#5F6368] flex gap-6">
                <span>English (United States)</span>
                <span>Help</span>
                <span>Privacy</span>
                <span>Terms</span>
            </div>
        </div>
    );
}
