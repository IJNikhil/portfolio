import Container from "./ui/Container";

export default function Footer() {
  return (
    <footer className="py-6 sm:py-8 md:py-10 bg-gray-900 text-gray-400 text-center">
      <Container>
        <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} Nikhileshwar Adam. All rights reserved.</p>
      </Container>
    </footer>
  );
}