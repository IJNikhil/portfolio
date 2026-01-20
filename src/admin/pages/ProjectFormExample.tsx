import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData } from "../../shared/utils/validationSchemas";
import { Input, TextArea, Select } from "../components/ui/Inputs";
import { toast } from "sonner";
import { usePortfolio } from "../../shared/context/PortfolioContext";

/**
 * Example: Simplified Project Form with React Hook Form + Zod Validation
 * 
 * This demonstrates the pattern to apply to all admin forms:
 * 1. Import validation schema and inferred type
 * 2. Use useForm with zodResolver
 * 3. Register inputs with {...register("fieldName")}
 * 4. Display errors from formState.errors
 * 5. Handle submit with validated data
 */

export default function ProjectFormExample() {
    const { addProject, updateProject } = usePortfolio();
    const isEditing = false; // Replace with actual logic

    // Initialize form with validation
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "Web",
            tags: [],
            link: "",
            github: "",
            image: "",
            featured: false
        }
    });

    // Watch tags array for dynamic updates
    const tags = watch("tags");

    // Submit handler - data is already validated!
    const onSubmit = async (data: ProjectFormData) => {
        try {
            if (isEditing) {
                await updateProject(data as any); // Cast to Project type
                toast.success("Project updated successfully!");
            } else {
                await addProject(data as any);
                toast.success("Project created successfully!");
                reset(); // Clear form after creation
            }
        } catch (error) {
            toast.error("Failed to save project");
        }
    };

    // Add tag helper
    const handleAddTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            setValue("tags", [...tags, tag]);
        }
    };

    // Remove tag helper
    const handleRemoveTag = (tagToRemove: string) => {
        setValue("tags", tags.filter(t => t !== tagToRemove));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            <h2 className="text-2xl font-bold">
                {isEditing ? "Edit Project" : "Create New Project"}
            </h2>

            {/* Title Field */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Project Title *
                </label>
                <input
                    {...register("title")}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="My Awesome Project"
                />
                {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Description Field */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Description *
                </label>
                <textarea
                    {...register("description")}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Describe your project..."
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Category Field */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Category *
                </label>
                <select
                    {...register("category")}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Desktop">Desktop</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                </select>
                {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.category.message}
                    </p>
                )}
            </div>

            {/* Tags Field (Custom Handling) */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Tags * (at least 1 required)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                        <span
                            key={tag}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-red-600"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add a tag..."
                        className="flex-1 px-4 py-2 border rounded-md"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag(e.currentTarget.value);
                                e.currentTarget.value = "";
                            }
                        }}
                    />
                </div>
                {errors.tags && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.tags.message}
                    </p>
                )}
            </div>

            {/* Link Field (Optional) */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Live Demo URL (optional)
                </label>
                <input
                    {...register("link")}
                    type="url"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="https://myproject.com"
                />
                {errors.link && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.link.message}
                    </p>
                )}
            </div>

            {/* GitHub Field (Optional) */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    GitHub Repository (optional)
                </label>
                <input
                    {...register("github")}
                    type="url"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/username/repo"
                />
                {errors.github && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.github.message}
                    </p>
                )}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2">
                <input
                    {...register("featured")}
                    type="checkbox"
                    id="featured"
                    className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                    Feature this project on homepage
                </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
                </button>
                <button
                    type="button"
                    onClick={() => reset()}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
                >
                    Reset
                </button>
            </div>

            {/* Validation Summary (Development Helper) */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800 font-medium mb-2">
                        Please fix the following errors:
                    </p>
                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                        {Object.entries(errors).map(([field, error]) => (
                            <li key={field}>
                                <strong>{field}:</strong> {error.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
}

/**
 * INTEGRATION NOTES:
 * 
 * 1. Replace manual state management:
 *    ❌ const [formData, setFormData] = useState({...});
 *    ✅ const { register, handleSubmit, ... } = useForm({...});
 * 
 * 2. Replace onChange handlers:
 *    ❌ <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
 *    ✅ <input {...register("title")} />
 * 
 * 3. Add error display:
 *    ✅ {errors.title && <p className="text-red-500">{errors.title.message}</p>}
 * 
 * 4. Handle submit with validated data:
 *    ❌ const handleSubmit = (e) => { e.preventDefault(); ... }
 *    ✅ const onSubmit = async (data: ProjectFormData) => { ... }
 * 
 * 5. For complex fields (arrays, file uploads):
 *    - Use setValue() to update programmatically
 *    - Use watch() to observe changes
 *    - Use Controller from react-hook-form for custom components
 */
