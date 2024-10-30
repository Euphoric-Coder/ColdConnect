// HeroSection.tsx
import { Button } from "./ui/button"; // Adjust the import path as necessary
import Typewriter from "typewriter-effect";

export default function HeroSection() {
  const buttonGradient =
    "bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 hover:from-blue-500 hover:via-teal-500 hover:to-green-500";

  // Smooth scroll function to a specific id
  const handleScrollToSection = () => {
    const targetSection = document.getElementById("mail-generate");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row relative overflow-hidden justify-around items-center font-mono px-6 py-8 md:px-10 md:py-10 lg:px-20 lg:py-16 h-fit gap-1 md:gap-15 m-0 p-0">
      {/* Text Section */}
      <div className="relative w-full md:w-1/2 space-y-6 text-center md:text-left px-4 md:px-8 lg:px-16">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 leading-tight">
          Streamline Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-green-400 font-extrabold">
            Cold Email Outreach
          </span>
        </h1>

        {/* Typewriter Effect */}
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-green-500">
          <Typewriter
            options={{
              strings: [
                "Generate Tailored Cold Emails",
                "Boost Your Job Applications",
                "Customize for Every Opportunity",
                "Stand Out with Personalized Outreach",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>

        {/* Paragraph */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-mono font-bold text-gray-700 opacity-90 leading-relaxed text-justify">
          Get started with your next{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 font-bold">
            career opportunity
          </span>{" "}
          using our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold">
            Cold Mail Generator
          </span>
          . Simply input job details and upload your resume to generate{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 font-bold">
            personalized cold emails
          </span>{" "}
          that showcase your unique skills and experience. Stand out from the
          crowd with a professional touch that{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500 font-bold">
            opens doors
          </span>{" "}
          to your dream roles.
        </p>

        {/* Call to Action Button */}
        <div className="mt-6">
          <Button
            onClick={handleScrollToSection}
            className={`px-4 py-2 sm:px-6 sm:py-3 md:px-10 md:py-4 text-base sm:text-lg md:text-xl font-bold text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-transform duration-300 ${buttonGradient}`}
          >
            Start Generating Emails
          </Button>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-full md:w-1/2 justify-center md:block hidden">
        <img
          src="/coder.png" // Replace with your image path
          alt="Cold Mail Generation Illustration"
          width={900}
          height={950}
          className="transition-transform transform hover:scale-110 duration-500"
        />
      </div>
    </div>
  );
}
