// import Container from "./ui/Container";
// import SectionTitle from "./ui/SectionTitle";

// export default function EducationSection({ data }) {
//   if (!data || data.length === 0) return null;

//   return (
//     <section className="py-8 sm:py-12 md:py-16 bg-bg scroll-mt-16">
//       <Container>
//         <SectionTitle>Education</SectionTitle>
//         <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
//           {data.map((edu, i) => (
//             <div
//               key={i}
//               className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
//               style={{ animationDelay: `${i * 0.2}s` }}
//             >
//               <div className="bg-card/30 backdrop-blur-md p-6 sm:p-8 rounded-lg border border-gray-700/50 shadow-lg text-center sm:text-left">
//                 <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text mb-2 sm:mb-3 font-serif">{edu.degree}</h3>
//                 <p className="text-gray-300 text-base sm:text-lg">{edu.institution}</p>
//                 <p className="text-gray-400 text-sm sm:text-base">{edu.duration}</p>
//                 <p className="text-gray-400 text-sm sm:text-base mt-1">{edu.score}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }