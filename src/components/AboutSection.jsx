// import { motion } from "framer-motion";
// import GlassCard from "./ui/GlassCard";
// import Button from "./ui/Button";
// import Container from "./ui/Container";
// import SectionTitle from "./ui/SectionTitle";

// export default function AboutSection({ data }) {
//   return (
//     <section className="py-16 bg-bg">
//       <Container>
//         <SectionTitle>About Me</SectionTitle>
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <GlassCard className="max-w-3xl mx-auto">
//             <p className="text-gray-300 mb-6">{data.bio}</p>
//             <Button variant="primary" onClick={() => window.open(data.resumeUrl, "_blank")}>
//               Download Resume
//             </Button>
//           </GlassCard>
//         </motion.div>
//       </Container>
//     </section>
//   );
// }