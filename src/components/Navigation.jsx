import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { label: "Journey & Education", id: "stats-education" },
    { label: "Showcase", id: "showcase" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contactSocial" },
  ];

  const smoothScrollTo = (targetPosition, duration) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = (t) => t * t * (3 - 2 * t);
      window.scrollTo(0, startPosition + distance * ease(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const handleScroll = (id) => {
    try {
      const element = document.getElementById(id);
      if (element) {
        const offset = 60;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(elementPosition - offset, 1000);
        setIsOpen(false);
      } else {
        console.warn(`Section with ID "${id}" not found`);
      }
    } catch (error) {
      console.error(`Error scrolling to section "${id}":`, error);
    }
  };

  useEffect(() => {
    const checkSections = () => {
      navItems.forEach((item) => {
        if (!document.getElementById(item.id)) {
          console.warn(`Section with ID "${item.id}" not found on initial load`);
        }
      });
    };
    const timeout = setTimeout(checkSections, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <nav
      className="absolute top-4 left-0 right-0 z-10 p-4 sm:p-6"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center sm:justify-end">
        <button
          className="sm:hidden text-gray-300 hover:text-accent text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row sm:gap-6 bg-gray-900/90 sm:bg-transparent absolute sm:static top-12 left-0 right-0 p-4 sm:p-0 rounded-b-lg sm:rounded-none`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className="text-gray-300 hover:text-accent text-base sm:text-lg font-medium transition-colors duration-300 py-2 sm:py-0"
              aria-label={`Scroll to ${item.label} section`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}


// import { useState, useEffect } from "react";
// import { FaBars, FaTimes } from "react-icons/fa";

// function Navigation() {
//   const [isOpen, setIsOpen] = useState(false);
//   const navItems = [
//     // { label: "Journey & Education", id: "stats-education" },
//     { label: "Showcase", id: "showcase" },
//     { label: "Skills", id: "skills" },
//     { label: "Contact", id: "contactSocial" },
//   ];

//   const smoothScrollTo = (targetPosition, duration) => {
//     const startPosition = window.scrollY;
//     const distance = targetPosition - startPosition;
//     let startTime = null;

//     const animation = (currentTime) => {
//       if (startTime === null) startTime = currentTime;
//       const timeElapsed = currentTime - startTime;
//       const progress = Math.min(timeElapsed / duration, 1);
//       const ease = (t) => t * t * (3 - 2 * t);
//       window.scrollTo(0, startPosition + distance * ease(progress));

//       if (timeElapsed < duration) {
//         requestAnimationFrame(animation);
//       }
//     };

//     requestAnimationFrame(animation);
//   };

//   const handleScroll = (id) => {
//     try {
//       const element = document.getElementById(id);
//       if (element) {
//         const offset = 60;
//         const elementPosition = element.getBoundingClientRect().top + window.scrollY;
//         smoothScrollTo(elementPosition - offset, 1000);
//         setIsOpen(false);
//       } else {
//         console.warn(`Section with ID "${id}" not found`);
//       }
//     } catch (error) {
//       console.error(`Error scrolling to section "${id}":`, error);
//     }
//   };

//   useEffect(() => {
//     const checkSections = () => {
//       navItems.forEach((item) => {
//         if (!document.getElementById(item.id)) {
//           console.warn(`Section with ID "${item.id}" not found on initial load`);
//         }
//       });
//     };
//     const timeout = setTimeout(checkSections, 0);
//     return () => clearTimeout(timeout);
//   }, []);

//   return (
//     <nav
//       className="absolute top-4 left-0 right-0 z-10 p-4 sm:p-6"
//       role="navigation"
//       aria-label="Main navigation"
//     >
//       <div className="flex justify-between items-center sm:justify-end">
//         <button
//           className="sm:hidden text-gray-300 hover:text-accent text-2xl"
//           onClick={() => setIsOpen(!isOpen)}
//           aria-label={isOpen ? "Close navigation" : "Open navigation"}
//         >
//           {isOpen ? <FaTimes /> : <FaBars />}
//         </button>
//         <div
//           className={`${
//             isOpen ? "flex" : "hidden"
//           } sm:flex flex-col sm:flex-row sm:gap-6 bg-gray-900/90 sm:bg-transparent absolute sm:static top-12 left-0 right-0 p-4 sm:p-0 rounded-b-lg sm:rounded-none`}
//         >
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleScroll(item.id)}
//               className="text-gray-300 hover:text-accent text-base sm:text-lg font-medium transition-colors duration-300 py-2 sm:py-0"
//               aria-label={`Scroll to ${item.label} section`}
//             >
//               {item.label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navigation;