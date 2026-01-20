import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { resolveDriveImage } from "../../shared/utils/driveHelper";
import ProjectSkeleton from "./ProjectSkeleton";

export default function Showcase({ data, loading }) {
  if (loading) {
    return (
      <section id="showcase" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse mb-4" />
            <div className="h-12 w-64 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[200px]">
            {/* Skeleton Grid Pattern matching the Bento Layout */}
            <div className="md:col-span-2 md:row-span-2 h-full"><ProjectSkeleton /></div>
            <div className="md:col-span-1 md:row-span-2 h-full"><ProjectSkeleton /></div>
            <div className="md:col-span-1 md:row-span-1 h-full"><ProjectSkeleton /></div>
            <div className="md:col-span-1 md:row-span-1 h-full"><ProjectSkeleton /></div>
          </div>
        </div>
      </section>
    );
  }

  if (!data?.length) return null;

  return (
    <section id="showcase" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-accent font-medium tracking-wider uppercase text-sm">Selected Work</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-4 mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[200px]">
          {data.slice(0, 4).map((project, i) => {
            // Bento Logic:
            // Index 0 (Featured): Col 2, Row 2 (Large Square)
            // Index 1 (Tall): Col 1, Row 2 (Vertical Rectangle) - Optional variation
            // Standard: 1x1

            // Let's do a classic Bento:
            // [ Large 2x2 ] [ Tall 1x2 ]
            //               [ Small 1x1 ]
            // ... wait, 3 columns? Or 4?
            // Let's try a 3-column grid for standard Bento feel.
            // [ 2x2 ] [ 1x1 ]
            //         [ 1x1 ]

            // Revised Grid for 4 items:
            // Grid Cols: 3.
            // Item 0: col-span-2 row-span-2 (Big Left)
            // Item 1: col-span-1 row-span-1 (Top Right)
            // Item 2: col-span-1 row-span-1 (Bottom Right)
            // Item 3: ... if 4 items, we need more space.

            // Let's do a 4-column grid for flexibility.
            let gridClasses = "md:col-span-1 md:row-span-1"; // Default small

            if (i === 0) gridClasses = "md:col-span-2 md:row-span-2"; // Big Feature
            else if (i === 1) gridClasses = "md:col-span-1 md:row-span-2"; // Tall Sidebar
            // Items 2 and 3 are 1x1

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group relative rounded-2xl overflow-hidden bg-background-card-dark bento-border transition-all hover:border-primary/50 ${gridClasses}`}
              >
                {/* Image */}
                {project.image && (
                  <img
                    src={resolveDriveImage(project.image)}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-40"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Gradient Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top Bar */}
                  <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <span className="px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] sm:text-xs font-mono uppercase text-primary border border-primary/20">
                      {project.category}
                    </span>
                    <div className="flex gap-2">
                      {(project.github || project.githubUrl) && (
                        <a href={project.github || project.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-black/50 rounded hover:bg-white hover:text-black transition-colors text-white">
                          <Github size={14} />
                        </a>
                      )}
                      {project.isLive && (project.link || project.liveUrl) && (
                        <a href={project.link || project.liveUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-white text-black rounded hover:bg-accent-teal transition-colors">
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="">
                    <h3 className={`font-bold text-white mb-1 group-hover:text-accent-teal transition-colors ${i === 0 ? "text-2xl" : "text-lg"}`}>
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 md:line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
