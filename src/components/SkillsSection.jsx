import { FaCode } from "react-icons/fa";
import Badge from "./ui/Badge";
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";

export default function SkillsSection({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section id="skills" className="py-8 sm:py-12 md:py-16 bg-bg scroll-mt-16">
      <Container>
        <SectionTitle>Skills</SectionTitle>
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
          {data.map((skill, i) => (
            <div
              key={i}
              className="opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
              style={{ animationDelay: `${i * 0.05}s` }}
              aria-label={`Skill: ${skill.name}`}
            >
              <Badge className="text-sm sm:text-base flex items-center gap-2">
                <FaCode className="text-accent text-sm" />
                {skill.name}
              </Badge>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}



// // SkillsSection.js
// import Badge from "./ui/Badge";
// import Container from "./ui/Container";
// import SectionTitle from "./ui/SectionTitle";

// export default function SkillsSection({ data }) {
//   if (!data || data.length === 0) return null;

//   return (
//     <section className="py-8 sm:py-12 md:py-16 bg-bg scroll-mt-16">
//       <Container>
//         <SectionTitle>Skills</SectionTitle>
//         <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
//           {data.map((skill, i) => (
//             <div
//               key={i}
//               className="opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
//               style={{ animationDelay: `${i * 0.05}s` }}
//             >
//               <Badge className="text-sm sm:text-base">{skill.name}</Badge>
//             </div>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }
