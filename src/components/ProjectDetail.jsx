import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked"; // Import marked as a module
import DOMPurify from "dompurify"; // Import DOMPurify as a module
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";
import Button from "./ui/Button";

export default function ProjectDetail({ projects }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => encodeURIComponent(p.title) === id);
  const [readmeContent, setReadmeContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project && project.link) {
      const repoName = project.link.split("/").pop();
      const fetchReadme = async () => {
        try {
          const response = await fetch(
            `https://api.github.com/repos/IJNikhil/${repoName}/readme`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch README");
          const data = await response.json();
          let decodedContent = atob(data.content);

          // Replace relative image paths with raw GitHub URLs
          decodedContent = decodedContent.replace(
            /!\[(.*?)\]\((?!http)(.*?)\)/g,
            (match, altText, relativePath) => {
              const absolutePath = `https://raw.githubusercontent.com/IJNikhil/${repoName}/main/${relativePath}`;
              return `![${altText}](${absolutePath})`;
            }
          );

          // Parse and sanitize Markdown
          const htmlContent = marked.parse(decodedContent, {
            gfm: true, // Enable GitHub Flavored Markdown
            breaks: true, // Convert newlines to <br>
          });
          const sanitizedContent = DOMPurify.sanitize(htmlContent, {
            ADD_TAGS: ["img"], // Allow img tags
            ADD_ATTR: ["src", "alt"], // Allow src and alt attributes for images
          });
          setReadmeContent(sanitizedContent);
          setLoading(false);
        } catch (err) {
          setError("Could not load project details. Please try again later.");
          setLoading(false);
        }
      };
      fetchReadme();
    } else {
      setError("Project not found.");
      setLoading(false);
    }
  }, [project]);

  if (!project) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-bg min-h-screen">
        <Container>
          <SectionTitle>Project Not Found</SectionTitle>
          <p className="text-gray-300 text-center">
            The requested project could not be found.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/")}
            className="mt-4"
          >
            Back to Home
          </Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-bg min-h-screen">
      <Container>
        <div className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]">
          <SectionTitle>{project.title}</SectionTitle>
          <div className="bg-card/30 backdrop-blur-md p-6 sm:p-8 rounded-lg border border-gray-700/50 shadow-lg mb-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text mb-3 font-serif">
              {project.title}
            </h3>
            <p className="text-gray-300 text-base sm:text-lg mb-4">
              {project.description}
            </p>
            <Button
              variant="primary"
              onClick={() => window.open(project.link, "_blank")}
              className="mb-4"
            >
              View GitHub Repository
            </Button>
            {loading && (
              <div className="text-center">
                <svg
                  className="animate-spin h-8 w-8 text-gray-400 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-400 mt-2">Loading project details...</p>
              </div>
            )}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {!loading && !error && (
              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: readmeContent }}
              />
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mx-auto block"
          >
            Back to Home
          </Button>
        </div>
      </Container>
    </section>
  );
}



// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Container from "./ui/Container";
// import SectionTitle from "./ui/SectionTitle";
// import Button from "./ui/Button";

// export default function ProjectDetail({ projects }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const project = projects.find(p => encodeURIComponent(p.title) === id);
//   const [readmeContent, setReadmeContent] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadScripts = () => {
//       const markedScript = document.createElement("script");
//       markedScript.src = "https://cdn.jsdelivr.net/npm/marked@4.0.12/marked.min.js";
//       markedScript.async = true;

//       const purifyScript = document.createElement("script");
//       purifyScript.src = "https://cdn.jsdelivr.net/npm/dompurify@2.3.6/dist/purify.min.js";
//       purifyScript.async = true;

//       document.body.appendChild(markedScript);
//       document.body.appendChild(purifyScript);

//       return () => {
//         document.body.removeChild(markedScript);
//         document.body.removeChild(purifyScript);
//       };
//     };

//     loadScripts();

//     if (project && project.link) {
//       const repoName = project.link.split('/').pop();
//       const fetchReadme = async () => {
//         try {
//           const response = await fetch(`https://api.github.com/repos/IJNikhil/${repoName}/readme`, {
//             headers: {
//               Accept: "application/vnd.github.v3+json"
//             }
//           });
//           if (!response.ok) throw new Error("Failed to fetch README");
//           const data = await response.json();
//           const decodedContent = atob(data.content);
//           if (window.marked && window.DOMPurify) {
//             const htmlContent = window.marked.parse(decodedContent);
//             const sanitizedContent = window.DOMPurify.sanitize(htmlContent);
//             setReadmeContent(sanitizedContent);
//           } else {
//             setReadmeContent("<p>Markdown parser not loaded yet.</p>");
//           }
//           setLoading(false);
//         } catch (_) {
//           setError("Could not load project details. Please try again later.");
//           setLoading(false);
//         }
//       };
//       fetchReadme();
//     } else {
//       setError("Project not found.");
//       setLoading(false);
//     }
//   }, [project]);

//   if (!project) {
//     return (
//       <section className="py-8 sm:py-12 md:py-16 bg-bg min-h-screen">
//         <Container>
//           <SectionTitle>Project Not Found</SectionTitle>
//           <p className="text-gray-300 text-center">The requested project could not be found.</p>
//           <Button variant="primary" onClick={() => navigate("/")} className="mt-4">
//             Back to Home
//           </Button>
//         </Container>
//       </section>
//     );
//   }

//   return (
//     <section className="py-8 sm:py-12 md:py-16 bg-bg min-h-screen">
//       <Container>
//         <div className="opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]">
//           <SectionTitle>{project.title}</SectionTitle>
//           <div className="bg-card/30 backdrop-blur-md p-6 sm:p-8 rounded-lg border border-gray-700/50 shadow-lg mb-6">
//             <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text mb-3 font-serif">{project.title}</h3>
//             <p className="text-gray-300 text-base sm:text-lg mb-4">{project.description}</p>
//             <Button
//               variant="primary"
//               onClick={() => window.open(project.link, "_blank")}
//               className="mb-4"
//             >
//               Checkout GitHub Repo
//             </Button>
//             {loading && <p className="text-gray-400 text-center">Loading project details...</p>}
//             {error && <p className="text-red-400 text-center">{error}</p>}
//             {!loading && !error && (
//               <div
//                 className="prose prose-invert max-w-none text-gray-300"
//                 dangerouslySetInnerHTML={{ __html: readmeContent }}
//               />
//             )}
//           </div>
//           <Button variant="outline" onClick={() => navigate("/")} className="mx-auto block">
//             Back to Home
//           </Button>
//         </div>
//       </Container>
//     </section>
//   );
// }