import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

export default function Showcase({ data }) {
  if (!data?.length) return null;

  return (
    <section id="showcase" className="py-32 relative">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          {data.slice(0, 4).map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`group relative rounded-3xl overflow-hidden bg-card border border-white/5 hover:border-white/10 transition-colors ${i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"
                }`}
            >
              {/* Project Image Background (Mockup/Gradient) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black group-hover:scale-105 transition-transform duration-700" />

              {/* Overlay Content */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent h-2/3">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-start mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium border border-white/10">
                      {project.category || "Development"}
                    </span>
                    <div className="flex gap-2">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                          <Github size={16} />
                        </a>
                      )}
                      <a href={project.link || "#"} className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold font-display text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 line-clamp-2 text-sm md:text-base">{project.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}





// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import GlassCard from "./ui/GlassCard";
// import Button from "./ui/Button";
// import Container from "./ui/Container";
// import SectionTitle from "./ui/SectionTitle";
// import AnimatedLink from "./ui/AnimatedLink";

// export default function Showcase({ data, achievementsData }) {
//   if (!data || data.length === 0) return null;

//   const maxDisplayProjects = 4;
//   const displayProjects = data.slice(0, maxDisplayProjects - 1);
//   const hasMoreProjects = data.length > maxDisplayProjects - 1;
//   const displayAchievements = achievementsData?.slice(0, 4) || [];

//   return (
//     <section
//       id="showcase"
//       className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0b0b0c] via-[#101012] to-[#0b0b0c] text-gray-100 scroll-mt-16 overflow-hidden"
//     >
//       {/* Ambient background glows */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-[var(--accent)]/10 blur-[120px] rounded-full" />
//         <div className="absolute bottom-1/3 right-1/4 w-[280px] h-[280px] bg-[var(--accent)]/10 blur-[100px] rounded-full" />
//       </div>

//       <Container className="relative z-10">
//         <div className="text-center mb-2">
//           <SectionTitle>
//             <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
//               Showcase
//             </span>
//           </SectionTitle>
//         </div>

//         {/* === Two-Column Layout with Colorful Divider === */}
//         <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12">
//           {/* --- Vertical Divider --- */}
//           <div
//             className="hidden lg:block absolute left-1/2 top-0 h-full w-[2px]
//                        bg-gradient-to-b from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent)]
//                        opacity-60 rounded-full pointer-events-none transition-all duration-500
//                        hover:opacity-90 hover:shadow-[0_0_25px_var(--accent)/40]"
//           ></div>

//           {/* === Featured Projects === */}
//           <div>
//             <h3 className="text-lg sm:text-xl font-semibold mb-6 font-serif text-gray-200 tracking-wide">
//               Featured Projects
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//               {displayProjects.map((project, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: i * 0.1, duration: 0.5 }}
//                   viewport={{ once: true }}
//                 >
//                   <Link
//                     to={`/projects/${encodeURIComponent(project.title)}`}
//                     className="group block"
//                   >
//                     <GlassCard
//                       className="p-6 sm:p-7 border border-gray-700/40 rounded-2xl
//                                  bg-[#16161a]/70 backdrop-blur-md transition-all duration-300
//                                  hover:border-[var(--accent)]/50 hover:shadow-[0_0_35px_var(--accent)/15]
//                                  hover:-translate-y-1"
//                     >
//                       <h4
//                         className="text-base sm:text-lg font-semibold font-serif text-white mb-2
//                                    group-hover:text-[var(--accent)] transition-colors duration-300"
//                       >
//                         {project.title}
//                       </h4>
//                       <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
//                         {project.description}
//                       </p>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="border-[var(--accent)] text-[var(--accent)]
//                                    rounded-lg px-5 py-2 transition-all duration-300
//                                    hover:bg-[var(--accent)] hover:text-[var(--bg)]
//                                    hover:shadow-[0_0_20px_var(--accent)/40]"
//                       >
//                         View Details →
//                       </Button>
//                     </GlassCard>
//                   </Link>
//                 </motion.div>
//               ))}

//               {hasMoreProjects && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{
//                     delay: displayProjects.length * 0.1,
//                     duration: 0.5,
//                   }}
//                   viewport={{ once: true }}
//                   className="flex items-center justify-center"
//                 >
//                   <AnimatedLink to="/projects/all">
//                     <Button
//                       variant="outline"
//                       size="md"
//                       className="rounded-xl border border-[var(--accent)] text-[var(--accent)]
//                                  px-6 py-3 hover:bg-[var(--accent)] hover:text-[var(--bg)]
//                                  transition-all duration-300 hover:shadow-[0_0_20px_var(--accent)/40]"
//                     >
//                       View All Projects
//                     </Button>
//                   </AnimatedLink>
//                 </motion.div>
//               )}
//             </div>
//           </div>

//           {/* === Milestones === */}
//           <div>
//             <h3 className="text-lg sm:text-xl font-semibold mb-6 font-serif text-gray-200 tracking-wide">
//               Milestones
//             </h3>

//             {displayAchievements.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//                 {displayAchievements.map((achievement, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1, duration: 0.5 }}
//                     viewport={{ once: true }}
//                   >
//                     <GlassCard
//                       className="p-6 sm:p-7 border border-gray-700/40 rounded-2xl
//                                  bg-[#16161a]/70 backdrop-blur-md transition-all duration-300
//                                  hover:border-[var(--accent)]/50 hover:shadow-[0_0_35px_var(--accent)/15]
//                                  hover:-translate-y-1"
//                     >
//                       <h4
//                         className="text-base sm:text-lg font-semibold font-serif text-white mb-2
//                                    group-hover:text-[var(--accent)] transition-colors duration-300"
//                       >
//                         {achievement.title}
//                       </h4>
//                       <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
//                         {achievement.description}
//                       </p>
//                       {achievement.social && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() =>
//                             window.open(achievement.social, "_blank")
//                           }
//                           className="border-[var(--accent)] text-[var(--accent)]
//                                      rounded-lg px-5 py-2 transition-all duration-300
//                                      hover:bg-[var(--accent)] hover:text-[var(--bg)]
//                                      hover:shadow-[0_0_20px_var(--accent)/40]"
//                         >
//                           View Post →
//                         </Button>
//                       )}
//                     </GlassCard>
//                   </motion.div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-gray-500 text-center py-6 text-sm">
//                 No milestones available
//               </div>
//             )}
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }
