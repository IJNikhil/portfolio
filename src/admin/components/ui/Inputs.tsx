import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: string; // Material symbol name
    containerClassName?: string;
}

export function Input({ label, error, icon, className = "", containerClassName = "", ...props }: InputProps) {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && <label className="block text-xs font-bold text-[#5F6368] uppercase mb-2">{label}</label>}
            <div className="relative">
                {icon && (
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none select-none">
                        {icon}
                    </span>
                )}
                <input
                    className={`w-full border border-[#DADCE0] rounded-md py-2 text-sm text-[#202124] bg-white focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-none transition-colors placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500 ${icon ? 'pl-10 pr-3' : 'px-3'} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function TextArea({ label, error, className = "", containerClassName = "", ...props }: TextAreaProps) {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && <label className="block text-xs font-bold text-[#5F6368] uppercase mb-2">{label}</label>}
            <textarea
                className={`w-full border border-[#DADCE0] rounded-md p-3 text-sm text-[#202124] bg-white focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-none transition-colors placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500 min-h-[100px] resize-y ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    containerClassName?: string;
}

export function Select({ label, error, options, className = "", containerClassName = "", ...props }: SelectProps) {
    return (
        <div className={`w-full ${containerClassName}`}>
            {label && <label className="block text-xs font-bold text-[#5F6368] uppercase mb-2">{label}</label>}
            <div className="relative">
                <select
                    className={`w-full appearance-none border border-[#DADCE0] rounded-md py-2.5 pl-3 pr-8 text-sm text-[#202124] bg-white focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none select-none text-lg">
                    expand_more
                </span>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

export function TitleInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full text-xl md:text-2xl font-normal border-b-2 border-gray-200 focus:border-[#1A73E8] focus:bg-gray-50 outline-none py-2 transition-colors placeholder-gray-300 bg-transparent text-[#202124] ${className}`}
            {...props}
        />
    );
}
