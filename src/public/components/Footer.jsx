import Container from "./ui/Container";
import AnimatedLink from "./ui/AnimatedLink";

export default function Footer() {
  return (
    <footer className="relative pt-6 pb-4 sm:pt-8 sm:pb-6 bg-card text-gray-500 text-center text-sm">
      
      {/* Colored Divider Line (Accent Gradient) */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent via-accent-secondary to-accent"></div>
      
      <Container className="space-y-2">
        
        {/* Credit Link */}
        <p className="text-gray-400">
          Built and Designed by{" "}
          <AnimatedLink 
            to="/" 
            className="font-semibold !text-accent-secondary hover:!text-accent transition-all duration-300 inline-block !min-h-0 !min-w-0"
          >
            Nikhileshwar Adam
          </AnimatedLink>
        </p>
        
        {/* Copyright */}
        <p className="text-xs opacity-70">
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </p>
      </Container>
    </footer>
  );
}