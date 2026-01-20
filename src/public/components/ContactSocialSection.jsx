import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Mail, Twitter } from "lucide-react";
// Assuming UI components exist or using standard HTML/Tailwind for speed + strict theme match
// import Input from "./ui/Input"; 
// import Textarea from "./ui/Textarea"; 
// import Button from "./ui/Button";

import { GoogleSheetsService } from "../../shared/services/googleSheets";

export default function ContactSocialSection({ contactData }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmissionStatus("loading");

    try {
      // Use 'sub_msg' action as defined in backend logic
      const res = await GoogleSheetsService.request({
        action: "sub_msg",
        data: form
      });

      if (res.success !== false) {
        setSubmissionStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSubmissionStatus("error");
    }
    setTimeout(() => setSubmissionStatus(null), 4000);
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Contact Info Side */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Let's work together</h2>
              <p className="text-xl text-slate-400 max-w-md font-sans">
                {/* Prevent redundant subtitle if intro is default or same as title */}
                {(contactData?.intro && contactData.intro !== "Let's work together")
                  ? contactData.intro
                  : "Have a project in mind? I'd love to hear about it."}
              </p>
            </motion.div>

            <div className="flex gap-6">
              {contactData?.github && (
                <a href={`https://github.com/${contactData.github}`} target="_blank" rel="noreferrer" className="p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary/20 hover:border-primary/50 transition-all group">
                  <Github size={24} className="group-hover:text-primary transition-colors" />
                </a>
              )}
              {contactData?.linkedin && (
                <a href={contactData.linkedin} target="_blank" rel="noreferrer" className="p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary/20 hover:border-primary/50 transition-all group">
                  <Linkedin size={24} className="group-hover:text-primary transition-colors" />
                </a>
              )}
              {contactData?.email && (
                <a href={`mailto:${contactData.email}`} className="p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary/20 hover:border-primary/50 transition-all group">
                  <Mail size={24} className="group-hover:text-primary transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Form Side - Bento Card Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-background-card-dark border border-white/10 shadow-2xl relative overflow-hidden terminal-glow"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inputs Group - Single column for simplicity and ease of entry */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 font-sans ml-1">Your Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="ex. John Doe"
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 text-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-white/20 hover:border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 font-sans ml-1">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ex. john@company.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 text-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-white/20 hover:border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 font-sans ml-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={contactData?.messagePlaceholder || "Tell me about your project..."}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 text-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-white/20 resize-none hover:border-white/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submissionStatus === "loading"}
                className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
              >
                {submissionStatus === "loading" ? "Sending..." : (
                  <>Send Message <Send size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              {submissionStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center text-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Message received! I'll get back to you soon.
                </motion.div>
              )}
              {submissionStatus === "error" && (
                <p className="text-red-400 text-center text-sm font-mono mt-2">Something went wrong. Please try again.</p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
