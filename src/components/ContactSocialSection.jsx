import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import Container from "./ui/Container";
import SectionTitle from "./ui/SectionTitle";
import Icon from "./ui/Icon";

export default function ContactSocialSection({ contactData, socialData }) {
  const email = contactData?.email || "nikhileshwar.adam@example.com";
  const intro = contactData?.intro || "Reach out and say hi anytime.";
  const messagePlaceholder = contactData?.messagePlaceholder || "Your message...";

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-t from-gray-900 to-bg scroll-mt-16">
      <Container>
        <SectionTitle className="mb-6 md:mb-8">Contact Me</SectionTitle>
        <p
          className="text-gray-300 mb-6 max-w-lg mx-auto text-sm sm:text-base opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          {intro}
        </p>
        <div
          className="space-y-6 max-w-lg mx-auto opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <Input name="name" placeholder="Your Name" required />
          <Input type="email" name="email" placeholder="Your Email" required />
          <Textarea name="message" placeholder={messagePlaceholder} rows={4} required />
          <Button
            type="button"
            variant="primary"
            className="w-full py-3 text-base"
            onClick={() => window.location.href = `mailto:${email}`}
          >
            Send Message
          </Button>
        </div>
        <hr className="border-t border-gray-700/50 my-10 sm:my-12 md:my-16 mx-auto w-3/4 sm:w-1/2" />
        {socialData && socialData.length > 0 && (
          <>
            <SectionTitle className="mb-6 md:mb-8">Connect</SectionTitle>
            <div
              className="flex flex-wrap justify-center gap-5 opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]"
              style={{ animationDelay: "0.4s" }}
            >
              {socialData.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-text hover:text-accent transition-colors duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <Icon name={item.label} className="mb-1 text-3xl sm:text-4xl" />
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{item.label}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
