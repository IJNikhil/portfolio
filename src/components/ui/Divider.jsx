export default function Divider({ className = "" }) {
  return (
    <hr className={`border-t border-gray-700/50 my-8 sm:my-10 md:my-12 mx-auto w-3/4 sm:w-1/2 ${className}`} />
  );
}