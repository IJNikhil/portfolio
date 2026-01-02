import { motion } from "framer-motion";

export default function SkillsSection({ data }) {
  if (!data?.length) return null;

  return (
    <section id="skills" className="py-24 bg-black/20 overflow-hidden">
      <div className="container mx-auto px-6 mb-12 text-center">
        <h2 className="text-3xl font-display font-bold text-gray-200">
          Technologies <span className="text-gray-600">&</span> Tools
        </h2>
      </div>

      <div className="relative flex">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-10" />

        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 px-4"
        >
          {[...data, ...data].map((skill, i) => (
            <div
              key={i}
              className="px-6 py-3 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm whitespace-nowrap text-gray-300 font-medium hover:border-accent/40 hover:text-white transition-colors cursor-default"
            >
              {skill.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
