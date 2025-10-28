// import { useState, useEffect } from "react";
// import GlassCard from "./ui/GlassCard";
// import Container from "./ui/Container";
// import SectionTitle from "./ui/SectionTitle";

// export default function StatsSection({ data }) {
//   const [githubRepos, setGithubRepos] = useState(5); // Fallback from manual verification

//   // GitHub Integration: Fetch public repo count
//   useEffect(() => {
//     const fetchGithubData = async () => {
//       try {
//         const response = await fetch('https://api.github.com/users/IJNikhil');
//         if (!response.ok) throw new Error('API error');
//         const userData = await response.json();
//         setGithubRepos(userData.public_repos || 5);
//       } catch (error) {
//         console.error('GitHub fetch error (public API rate limit?):', error);
//       }
//     };
//     fetchGithubData();
//   }, []);

//   // Update stats with live GitHub data
//   const updatedStats = data.map(stat => 
//     stat.label === 'GitHub Repos' ? { ...stat, value: githubRepos.toString() } : stat
//   );

//   if (!updatedStats || updatedStats.length === 0) return null;

//   return (
//     <section className="py-8 sm:py-12 md:py-16 bg-bg scroll-mt-16">
//       <Container>
//         <SectionTitle>My Journey</SectionTitle>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
//           {updatedStats.map((stat, i) => (
//             <div
//               key={i}
//               className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
//               style={{ animationDelay: `${i * 0.2}s` }}
//             >
//               <GlassCard className="text-center p-6 sm:p-8">
//                 <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-accent mb-3 sm:mb-4 font-serif">
//                   {stat.value}
//                 </div>
//                 <div className="text-gray-300 text-base sm:text-lg font-medium">{stat.label}</div>
//                 <p className="text-gray-400 text-sm sm:text-base mt-2">{stat.description}</p>
//               </GlassCard>
//             </div>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }