import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import Container from "./ui/Container";
import Button from "./ui/Button";

export default function ProjectDetail({ projects }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => encodeURIComponent(p.title) === id);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ UTF-8-safe Base64 decode
  const decodeBase64UTF8 = (base64) => {
    try {
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      return new TextDecoder("utf-8").decode(bytes);
    } catch (err) {
      console.error("UTF-8 decode error:", err);
      return atob(base64);
    }
  };

  useEffect(() => {
    if (!project) {
      setError("Project not found.");
      setLoading(false);
      return;
    }

    const repoName = project.link.split("/").pop();

    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true,
      mangle: false,
      highlight: (code, lang) => {
        const valid = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language: valid }).value;
      },
    });

    const fetchReadme = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/IJNikhil/${repoName}/readme`,
          { headers: { Accept: "application/vnd.github.v3+json" } }
        );
        if (!response.ok) throw new Error("Failed to fetch README");
        const data = await response.json();
        let decoded = decodeBase64UTF8(data.content);

        // Fix relative image paths
        decoded = decoded.replace(
          /!\[(.*?)\]\((?!http)(.*?)\)/g,
          (match, alt, relativePath) => {
            const absolutePath = `https://raw.githubusercontent.com/IJNikhil/${repoName}/main/${relativePath}`;
            return `![${alt}](${absolutePath})`;
          }
        );

        const html = marked.parse(decoded);
        const sanitized = DOMPurify.sanitize(html, {
          ADD_TAGS: ["img"],
          ADD_ATTR: ["src", "alt"],
        });
        setContent(sanitized);
      } catch {
        setError("Could not load README. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [project]);

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] text-gray-400">
        Project not found.
      </div>
    );

  return (
    <section className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0b0b0c] via-[#101012] to-[#0b0b0c] text-gray-200 min-h-screen overflow-hidden">
      {/* Ambient Glow Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[var(--accent)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[260px] h-[260px] bg-[var(--accent-secondary)]/10 blur-[100px] rounded-full" />
      </div>

      <Container>
        <div className="max-w-5xl mx-auto animate-[fadeIn_0.6s_ease-in-out_forwards]">
          {/* ---------- Header ---------- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-gray-700/40">
            <div>
              <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-white mb-2">
                {project.title}
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-3xl">
                {project.description}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => window.open(project.link, "_blank")}
              className="bg-[var(--accent)] hover:bg-[var(--accent-secondary)] 
                         text-[var(--bg)] font-semibold px-6 py-2.5 rounded-xl 
                         transition-all duration-300 shadow-[0_0_20px_var(--accent)/30] 
                         hover:shadow-[0_0_30px_var(--accent-secondary)/40]"
            >
              View Repository →
            </Button>
          </div>

          {/* ---------- Gradient Divider ---------- */}
          <div className="flex justify-center my-8">
            <div className="w-32 h-[3px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent)] rounded-full opacity-80 shadow-[0_0_20px_var(--accent-secondary)/30] animate-pulse-slow"></div>
          </div>

          {/* ---------- README Content ---------- */}
          <div
            className="bg-[#16161a]/70 border border-gray-700/40 rounded-2xl 
                       shadow-[0_0_25px_rgba(0,0,0,0.3)] p-8 sm:p-10 backdrop-blur-md 
                       hover:border-[var(--accent)]/40 hover:shadow-[0_0_40px_var(--accent)/15] 
                       transition-all duration-500"
          >
            {loading && (
              <div className="text-center text-gray-400 py-10 animate-pulse">
                Loading README...
              </div>
            )}

            {error && (
              <div className="text-center text-red-400 py-6">{error}</div>
            )}

            {!loading && !error && (
              <>
                <article
                  className="prose prose-invert max-w-none prose-lg leading-relaxed 
                             text-gray-200 tracking-wide prose-headings:text-white 
                             prose-a:text-[var(--accent)] hover:prose-a:text-[var(--accent-secondary)] 
                             prose-pre:bg-[#111] prose-code:text-blue-300 prose-img:rounded-xl 
                             prose-img:shadow-[0_0_20px_rgba(255,255,255,0.08)] prose-img:mx-auto
                             prose-img:max-w-full prose-ul:mt-4 prose-li:my-1.5"
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                {/* Bottom Repo Button */}
                <div className="flex justify-center mt-12">
                  <Button
                    variant="primary"
                    onClick={() => window.open(project.link, "_blank")}
                    className="bg-[var(--accent)] hover:bg-[var(--accent-secondary)] 
                               text-[var(--bg)] font-semibold px-6 py-2.5 rounded-xl 
                               transition-all duration-300 shadow-[0_0_25px_var(--accent)/30] 
                               hover:shadow-[0_0_35px_var(--accent-secondary)/40]"
                  >
                    View Repository →
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* ---------- Back Button ---------- */}
          <div className="flex justify-center mt-14">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-[var(--accent)] text-[var(--accent)] font-medium 
                         px-6 py-2.5 rounded-xl transition-all duration-300
                         hover:bg-[var(--accent)] hover:text-[var(--bg)] 
                         hover:shadow-[0_0_30px_var(--accent)/30]"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
