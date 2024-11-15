import React, { useState } from "react";
import axios from "axios";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FiLink } from "react-icons/fi";

interface JobURLFieldProps {
  jobUrl: string;
  setJobUrl: React.Dispatch<React.SetStateAction<string>>;
  companyName: string | null;
  setCompanyName: React.Dispatch<React.SetStateAction<string | null>>;
}

const JobURLField: React.FC<JobURLFieldProps> = ({
  jobUrl,
  setJobUrl,
  companyName,
  setCompanyName,
}) => {
  const [loading, setLoading] = useState(false);

  const handleBlur = async () => {
    if (jobUrl) {
      setLoading(true);
      const formData = new FormData();
      formData.append("job_url", jobUrl);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/fetch-company-name`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const data = response.data;
        if (data.company_name) {
          setCompanyName(data.company_name);
        } else {
          console.error("Error fetching company name:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch company name:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative w-full mt-10">
      {/* Enhanced Floating Label */}
      <Label
        htmlFor="job-url"
        className="absolute -top-4 left-6 text-lg font-semibold text-blue-100 bg-gradient-to-r from-blue-500 via-purple-400 to-teal-500 px-3 py-1 rounded-full shadow-md transform -translate-y-1/4 -translate-x-1/4 transition-all duration-300 ease-in-out z-20 cursor-pointer hover:scale-105"
      >
        Job URL 🔗
      </Label>

      <div className="relative w-full mt-6">
        {/* Link Icon */}
        <FiLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500 text-2xl" />

        {/* Input Field */}
        <Input
          id="job-url"
          type="text"
          placeholder="https://jobs.example.com"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          onBlur={handleBlur}
          className="w-full pl-14 pr-4 py-4 text-blue-800 placeholder:text-indigo-400 bg-gradient-to-r from-blue-50 via-white to-blue-100 border border-indigo-300 rounded-xl shadow-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
        />
      </div>

      {/* Loading Indicator and Company Name */}
      {loading ? (
        <p className="mt-3 text-indigo-500 font-medium animate-pulse flex items-center space-x-2">
          <span className="w-3 h-3 bg-indigo-500 animate-bounce rounded-full mr-1"></span>
          <span>Fetching company name...</span>
        </p>
      ) : companyName ? (
        <p className="mt-3 text-lg font-semibold text-indigo-600">
          Company: {companyName}
        </p>
      ) : null}
    </div>
  );
};

export default JobURLField;
