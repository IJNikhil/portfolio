import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";

// 🚨 IMPORTANT: REPLACE THIS with your actual deployed Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSoocITz8VhBE0ta3PAyv8bC34hgt20YYz9_AS2gqjHA-Xkadjms_jCymoxm3fu_YQCA/exec";

export default function ContactSocialSection({ contactData }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const icons = {
    Github,
    Linkedin,
    Mail,
    Twitter
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmissionStatus("loading");

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmissionStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmissionStatus("error");
    }
    setTimeout(() => setSubmissionStatus(null), 4000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Contact Info Side */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-display font-bold text-white mb-6">Let's work together</h2>
              <p className="text-xl text-gray-400 max-w-md">
                Have a project in mind? I'd love to hear about it. Drop me a line and I'll get back to you as soon as possible.
              </p>
            </motion.div>

            <div className="flex gap-6">
              {[
                { icon: Github, href: "https://github.com/IJNikhil" },
                { icon: Linkedin, href: "https://linkedin.com/in/ijnikhil" },
                { icon: Mail, href: "mailto:contact@example.com" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-accent/50 transition-all"
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-card border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Name</label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="bg-black/40 border-white/10 focus:border-accent text-white rounded-xl py-3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <Input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="bg-black/40 border-white/10 focus:border-accent text-white rounded-xl py-3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Message</label>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="bg-black/40 border-white/10 focus:border-accent text-white rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={submissionStatus === "loading"}
                className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
              >
                {submissionStatus === "loading" ? "Sending..." : (
                  <>Send Message <Send size={18} /></>
                )}
              </Button>

              {submissionStatus === "success" && (
                <p className="text-green-400 text-center text-sm">Message sent successfully!</p>
              )}
              {submissionStatus === "error" && (
                <p className="text-red-400 text-center text-sm">Something went wrong. Please try again.</p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
