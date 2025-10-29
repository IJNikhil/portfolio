import { FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import Badge from "./ui/Badge";
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";

export default function SkillsSection({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section
      id="skills"
      className="relative py-14 sm:py-16 bg-gradient-to-b from-[#060606] via-[#0c0c0f] to-[#090909] 
      text-text scroll-mt-16 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[260px] h-[260px] bg-[var(--accent)]/10 blur-[90px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[220px] h-[220px] bg-[var(--accent-secondary)]/10 blur-[80px] rounded-full"></div>
      </div>

      <Container>
        <SectionTitle>
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
            Skills
          </span>
        </SectionTitle>

        <motion.div
          className="flex flex-wrap justify-center gap-2.5 sm:gap-3 md:gap-4 mt-6 sm:mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {data.map((skill, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
            >
              <Badge
                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 
                bg-card/30 border border-gray-700/30 backdrop-blur-md 
                text-sm sm:text-base font-medium text-gray-200 rounded-xl 
                hover:border-[var(--accent)]/40 hover:text-[var(--accent)]/80 
                hover:shadow-[0_0_10px_var(--accent)/25]
                transition-all duration-300 cursor-default select-none"
                style={{
                  opacity: 1,
                  transform: "none",
                  boxShadow: "rgba(0, 0, 0, 0) 0px 0px 0px",
                }}
              >
                <FaCode className="text-[var(--accent)]/80 text-sm sm:text-base drop-shadow-[0_0_5px_var(--accent)/25]" />
                <span className="tracking-wide font-light">{skill.name}</span>
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
