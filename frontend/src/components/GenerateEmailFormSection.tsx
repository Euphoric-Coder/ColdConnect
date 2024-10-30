import { Button } from "./ui/button"; // Adjust the import path as necessary
import JobURLField from "./JobURLField";
import ResumeUpload from "./Drag&Drop";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Typewriter from "typewriter-effect";

interface MainFormSectionProps {
  jobUrl: string;
  setJobUrl: React.Dispatch<React.SetStateAction<string>>;
  companyName: string | null;
  setCompanyName: React.Dispatch<React.SetStateAction<string | null>>;
  handleFileSelect: (file: File | null) => void;
  handleSubmit: () => Promise<void>;
  loading: boolean;
  loadingText: string;
}

export default function MainFormSection({
  jobUrl,
  setJobUrl,
  companyName,
  setCompanyName,
  handleFileSelect,
  handleSubmit,
  loading,
  loadingText,
}: MainFormSectionProps) {
  const buttonGradient =
    "bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 hover:from-blue-500 hover:via-teal-500 hover:to-green-500";

  return (
    <div className="flex flex-col md:flex-row relative overflow-hidden justify-around items-center font-mono px-6 py-8 md:px-10 md:py-10 lg:px-20 lg:py-16 h-fit gap-8 md:gap-15 m-0 p-0">
      {/* Form Instructions Text Section */}
      <div className="relative w-full md:w-1/2 space-y-6 text-center md:text-left px-4 md:px-8 lg:px-16">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 leading-tight">
          Get Ready to Generate Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-green-400 font-extrabold">
            Perfect Cold Email
          </span>
        </h1>

        {/* Typewriter Effect */}
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-green-500">
          <Typewriter
            options={{
              strings: [
                "Ready to Ace Your Job Application?",
                "Generate the Perfect Cold Email",
                "Stand Out from the Crowd!",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>

        {/* Paragraph */}
        <div className="max-w-7xl mx-auto mt-10 px-4 lg:px-8 space-y-10">
          <h2 className="text-3xl sm:text-4xl md:text-xl lg:text-3xl font-extrabold text-center md:text-left xl:text-center bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-transparent bg-clip-text tracking-wide">
            Steps to Generate Your Perfect Cold Email:
          </h2>

          <ul className="space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
            {/* Step 1 */}
            <li className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 p-4 md:p-6 lg:p-8 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold bg-gradient-to-br from-blue-50 via-blue-100 to-teal-50 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-white text-base md:text-lg lg:text-xl xl:text-2xl">
                1
              </div>
              <span className="text-gray-800 text-center sm:text-left leading-snug sm:leading-normal lg:leading-relaxed">
                Enter the{" "}
                <span className="font-bold text-blue-500">Job URL</span> of the
                company in the provided field.
              </span>
            </li>

            {/* Step 2 */}
            <li className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 p-4 md:p-6 lg:p-8 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold bg-gradient-to-br from-teal-50 via-green-100 to-blue-50 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-full text-white text-base md:text-lg lg:text-xl xl:text-2xl">
                2
              </div>
              <span className="text-gray-800 text-center sm:text-left leading-snug sm:leading-normal lg:leading-relaxed">
                Upload your resume (
                <span className="font-bold text-teal-500">PDF only</span>) for a
                personal touch.
              </span>
            </li>

            {/* Step 3 */}
            <li className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 p-4 md:p-6 lg:p-8 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold bg-gradient-to-br from-pink-50 via-purple-100 to-indigo-50 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-full text-white text-base md:text-lg lg:text-xl xl:text-2xl">
                3
              </div>
              <span className="text-gray-800 text-center sm:text-left leading-snug sm:leading-normal lg:leading-relaxed">
                Click{" "}
                <span className="font-bold text-purple-500">
                  Generate Cold Email
                </span>{" "}
                to receive a tailored draft.
              </span>
            </li>

            {/* Step 4 */}
            <li className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-6 p-4 md:p-6 lg:p-8 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold bg-gradient-to-br from-purple-50 via-blue-100 to-green-50 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full text-white text-base md:text-lg lg:text-xl xl:text-2xl">
                4
              </div>
              <span className="text-gray-800 text-center sm:text-left leading-snug sm:leading-normal lg:leading-relaxed">
                <span>Review,</span> <span>personalize,</span> and <span>send</span> your cold email with confidence.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative w-full md:w-1/2 flex flex-col bg-white/10 backdrop-blur-lg border border-blue-300 shadow-lg rounded-2xl p-9 space-y-8">
        {/* Job URL Field */}
        <JobURLField
          jobUrl={jobUrl}
          setJobUrl={setJobUrl}
          companyName={companyName}
          setCompanyName={setCompanyName}
        />

        {/* Resume Upload Field */}
        <ResumeUpload onFileSelect={handleFileSelect} />

        {/* Generate Email Button */}
        <Button
          onClick={handleSubmit}
          className={`w-full py-4 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 text-xl font-semibold rounded-full shadow-md transform transition duration-300 hover:scale-105 active:scale-95 ${
            loading ? "cursor-not-allowed opacity-70" : ""
          } ${buttonGradient}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center animate-pulse">
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              {loadingText}
            </div>
          ) : (
            "Generate Cold Email"
          )}
        </Button>
      </div>
    </div>
  );
}
