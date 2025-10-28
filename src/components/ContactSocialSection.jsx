import { motion } from "framer-motion";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";
import Icon from "./ui/Icon";

export default function ContactSocialSection({ contactData, socialData }) {
  const email = contactData?.email || "nikhileshwar.adam@example.com";
  const intro =
    contactData?.intro ||
    "Let's connect to discuss innovative projects or opportunities!";
  const messagePlaceholder =
    contactData?.messagePlaceholder || "Type your message here...";

  return (
    <section
      id="contactSocial"
      className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0b0b0c] via-[#101012] to-[#0b0b0c] 
                 text-gray-100 scroll-mt-16 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[320px] h-[320px] bg-[var(--accent)]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[280px] h-[280px] bg-[var(--accent-secondary)]/10 blur-[100px] rounded-full"></div>
      </div>

      <Container>
        <div className="text-center mb-3">
          <SectionTitle>
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Get In Touch
            </span>
          </SectionTitle>
        </div>

        {/* Intro Text */}
        <motion.p
          className="text-gray-400 text-center max-w-xl mx-auto mt-2 mb-10 text-sm sm:text-base leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {intro}
        </motion.p>

        {/* Contact Form */}
        <motion.div
          className="max-w-2xl mx-auto bg-[#16161a]/70 backdrop-blur-md border border-gray-800/50 
                     rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.4)] p-6 sm:p-8
                     hover:shadow-[0_0_35px_var(--accent)/20] transition-all duration-500"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <form className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                name="name"
                placeholder="Your Name"
                required
                className="flex-1 bg-[#1a1a1a]/70 text-gray-200 border border-gray-700/50 
                focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40 
                placeholder-gray-500 rounded-lg transition-all duration-300"
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="flex-1 bg-[#1a1a1a]/70 text-gray-200 border border-gray-700/50 
                focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40 
                placeholder-gray-500 rounded-lg transition-all duration-300"
              />
            </div>

            <Textarea
              name="message"
              placeholder={messagePlaceholder}
              rows={5}
              required
              className="bg-[#1a1a1a]/70 text-gray-200 border border-gray-700/50 
              focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40 
              placeholder-gray-500 rounded-lg transition-all duration-300"
            />

            <div className="text-center pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={() => (window.location.href = `mailto:${email}`)}
                className="px-8 py-3 text-base font-semibold rounded-xl bg-[var(--accent)]/90 text-bg 
                hover:bg-[var(--accent)] hover:scale-[1.03] transition-all duration-300 
                shadow-[0_0_20px_var(--accent)/25] hover:shadow-[0_0_35px_var(--accent)/40]"
              >
                Send Message
              </Button>
            </div>
          </form>

          {/* Email Display */}
          <div className="text-center mt-6 text-sm text-gray-400">
            or email me directly at{" "}
            <a
              href={`mailto:${email}`}
              className="text-[var(--accent)] hover:text-[var(--accent-secondary)] transition-colors duration-300"
            >
              {email}
            </a>
          </div>
        </motion.div>

        {/* Stylish Divider */}
        <motion.div
          className="relative flex justify-center my-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div
            className="w-32 h-[3px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent)] 
                       rounded-full opacity-80 shadow-[0_0_20px_var(--accent-secondary)/40] animate-pulse-slow"
          ></div>
        </motion.div>

        {/* Social Links */}
        {socialData && socialData.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-8 sm:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {socialData.map((item, i) => (
              <motion.a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  scale: 1.15,
                  textShadow: "0 0 10px var(--accent)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
                className="flex flex-col items-center text-gray-300 hover:text-[var(--accent)] 
                           transition-all duration-300 group"
                aria-label={`Visit ${item.label}`}
              >
                <div className="relative">
                  <Icon
                    name={item.label}
                    className="text-3xl sm:text-4xl text-gray-300 group-hover:text-[var(--accent)] transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-[var(--accent)]/10 blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
                <span className="text-xs sm:text-sm font-medium tracking-wide mt-1 opacity-80 group-hover:opacity-100">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
