import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { GoogleSheetsService } from "../../../shared/services/googleSheets";
import { toast } from "sonner";

interface ImageUploaderProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    folder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, label = "Upload Image", folder }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(value);

    // Compress & Convert to WebP
    const processImage = async (file: File): Promise<{ base64: string, mime: string }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                // Resize Logic: Max width 1920
                let width = img.width;
                let height = img.height;
                const MAX_WIDTH = 1920;

                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);

                // Convert to WebP 0.8
                const dataUrl = canvas.toDataURL("image/webp", 0.8);
                // Remove prefix "data:image/webp;base64,"
                const base64 = dataUrl.split(",")[1];
                resolve({ base64, mime: "image/webp" });
            };
            img.onerror = reject;
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validations
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File is too large (Max 5MB)");
            return;
        }

        setIsUploading(true);
        // Optimization: Show local preview immediately (Optimistic feedback)
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            const { base64, mime } = await processImage(file);

            // Send to GAS
            // Note: We need a dedicated upload endpoint or the generic one handles it
            const response = await GoogleSheetsService.request<{ url: string }>({
                action: "UPLOAD_FILE",
                data: {
                    name: file.name.split('.')[0] + ".webp",
                    mimeType: mime,
                    base64: base64,
                    folder: folder // Pass folder if provided
                }
            });

            if (response.success && response.data?.url) {
                onChange(response.data.url);
                toast.success("Image uploaded!");
            } else {
                throw new Error(response.message || "Upload failed");
            }

        } catch (error) {
            console.error(error);
            toast.error("Upload failed");
            setPreview(value); // Revert
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>

            {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-xs text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                <p className="text-[10px] text-gray-400">JPG, PNG, WebP (Max 5MB)</p>
                            </>
                        )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                </label>
            ) : (
                <div className="relative group w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                    <img src={preview} alt="Queue" className="w-full h-full object-cover" />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            onClick={() => { setPreview(""); onChange(""); }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            title="Remove"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
