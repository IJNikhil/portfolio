export default function Divider({ className = "" }) {
  return (
    <hr className={`border-t-2 border-gray-700/60 my-10 sm:my-12 md:my-16 mx-auto w-11/12 sm:w-3/4 md:w-2/3 ${className}`} />
  );
}