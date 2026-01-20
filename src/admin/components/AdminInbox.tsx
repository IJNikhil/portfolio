import { useState, useEffect } from "react";
import { usePortfolio } from "../../shared/context/PortfolioContext";
import { Input } from "./ui/Inputs";
import { CheckCheck, Mail, ArrowLeft, Trash2, Reply } from "lucide-react";
import { format } from "date-fns";

export default function AdminInbox() {
    const { messages: contextMessages, markMessageRead, deleteMessage, isLoading } = usePortfolio();
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<"All" | "Unread">("All");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const messages = contextMessages || [];

    const filteredMessages = messages
        .filter((msg) => {
            if (filter === "Unread") return msg.status === "Unread";
            return true;
        })
        .filter((msg) =>
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const selectedMessage = messages.find(m => m.id === selectedId);

    // Auto-mark as read when selected
    useEffect(() => {
        if (selectedMessage && selectedMessage.status === "Unread") {
            const timer = setTimeout(() => {
                markMessageRead(selectedMessage.id);
            }, 1000); // 1-second delay before marking read
            return () => clearTimeout(timer);
        }
    }, [selectedId, selectedMessage, markMessageRead]);

    if (isLoading) return <div className="text-[#202124]">Loading inbox...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] max-w-7xl mx-auto md:px-8 pb-4 md:pb-8">

            {/* Header Area (Desktop Only / Conditional on Mobile) */}
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 px-4 md:px-0 shrink-0 ${selectedId ? 'hidden md:flex' : 'flex'}`}>
                <div className="flex items-center justify-between w-full md:w-auto">
                    <h2 className="text-2xl font-normal text-[#202124] flex items-center gap-3">
                        Inbox
                        {messages.filter(m => m.status === "Unread").length > 0 && (
                            <span className="text-xs bg-[#E8F0FE] text-[#1967D2] px-2 py-0.5 rounded-full font-mono">
                                {messages.filter(m => m.status === "Unread").length} new
                            </span>
                        )}
                    </h2>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Input
                            icon="search"
                            placeholder="Search mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border-[#DADCE0] h-10 md:h-9 text-sm rounded-full"
                            containerClassName="m-0"
                        />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200 shrink-0">
                        <button
                            onClick={() => setFilter("All")}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter === "All" ? "bg-white text-[#202124] shadow-sm" : "text-[#5F6368] hover:text-[#202124]"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("Unread")}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter === "Unread" ? "bg-white text-[#202124] shadow-sm" : "text-[#5F6368] hover:text-[#202124]"
                                }`}
                        >
                            Unread
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Split View */}
            <div className="flex-1 bg-white md:border border-[#DADCE0] md:rounded-lg shadow-sm overflow-hidden flex relative">

                {/* LIST PANE */}
                <div className={`w-full md:w-[380px] lg:w-[420px] flex flex-col border-r border-[#DADCE0] bg-white ${selectedId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="flex-1 overflow-y-auto">
                        {filteredMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-sm">
                                <Mail className="size-12 text-gray-300 mb-2" />
                                No messages found.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {filteredMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedId(msg.id)}
                                        className={`p-4 cursor-pointer transition-colors relative group flex gap-4 ${selectedId === msg.id ? 'bg-[#E8F0FE]' : 'hover:bg-gray-50'
                                            } ${msg.status === "Unread" ? 'bg-white' : 'bg-gray-50/30'}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 text-white font-medium text-sm ${msg.status === "Unread" ? "bg-[#1A73E8]" : "bg-[#5F6368]"
                                            }`}>
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className={`text-sm truncate pr-2 ${msg.status === "Unread" ? 'font-bold text-[#202124]' : 'font-medium text-[#202124]'}`}>
                                                    {msg.name}
                                                </h4>
                                                <span className={`text-[11px] shrink-0 ${msg.status === "Unread" ? 'text-[#1A73E8] font-bold' : 'text-[#5F6368]'}`}>
                                                    {format(new Date(msg.timestamp), "MMM d")}
                                                </span>
                                            </div>
                                            <p className={`text-sm line-clamp-2 ${msg.status === "Unread" ? 'text-[#202124] font-medium' : 'text-[#5F6368]'}`}>
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* DETAIL PANE */}
                {selectedMessage ? (
                    <div className={`flex-1 flex flex-col bg-white h-full ${!selectedId ? 'hidden' : 'flex absolute inset-0 md:static z-20'}`}>
                        {/* Mobile Toolbar */}
                        <div className="h-14 border-b border-[#DADCE0] flex items-center justify-between px-2 shrink-0 bg-white sticky top-0 z-10">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="md:hidden p-3 text-[#5F6368] hover:bg-gray-100 rounded-full"
                                >
                                    <ArrowLeft className="size-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-1 pr-2">
                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="p-3 text-[#5F6368] hover:text-[#202124] hover:bg-gray-100 rounded-full transition-colors"
                                    title="Reply"
                                >
                                    <Reply className="size-5" />
                                </a>
                                <button
                                    onClick={() => {
                                        if (window.confirm("Delete this message?")) {
                                            deleteMessage(selectedMessage.id);
                                            setSelectedId(null);
                                        }
                                    }}
                                    className="p-3 text-[#5F6368] hover:text-[#D93025] hover:bg-[#FCE8E6] rounded-full transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="size-5" />
                                </button>
                                {selectedMessage.status === "Unread" && (
                                    <button
                                        onClick={() => markMessageRead(selectedMessage.id)}
                                        className="ml-2 p-3 text-[#1A73E8] hover:bg-[#E8F0FE] rounded-full"
                                        title="Mark as Read"
                                    >
                                        <CheckCheck className="size-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8">
                            <div className="max-w-3xl mx-auto">
                                {/* Sender Header */}
                                <div className="flex items-start gap-4 mb-8">
                                    <div className={`size-12 rounded-full flex items-center justify-center text-lg font-medium text-white shrink-0 ${selectedMessage.status === "Unread" ? "bg-[#1A73E8]" : "bg-[#5F6368]"
                                        }`}>
                                        {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                                            <h1 className="text-lg font-bold text-[#202124] truncate">
                                                {selectedMessage.name}
                                            </h1>
                                            <span className="text-xs text-[#5F6368]">
                                                {format(new Date(selectedMessage.timestamp), "PPP 'at' p")}
                                            </span>
                                        </div>
                                        <div className="text-sm text-[#5F6368] truncate">
                                            &lt;{selectedMessage.email}&gt;
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="prose prose-sm md:prose-base max-w-none text-[#202124] whitespace-pre-wrap leading-relaxed">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Desktop Empty State */
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50/50 text-[#5F6368]">
                        <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                            <Mail className="size-12 text-[#1A73E8]" />
                        </div>
                        <p className="text-base font-medium text-[#202124]">Select a message to read</p>
                        <p className="text-sm text-[#5F6368]">Nothing selected from the list.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
