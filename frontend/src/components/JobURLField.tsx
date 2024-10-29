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
          "http://localhost:8900/fetch-company-name",
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
        className="absolute -top-5 left-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-300 via-teal-400 to-indigo-500 px-4 py-1 rounded-full shadow-xl transform -translate-y-[90%] -translate-x-[5%] transition-all duration-300 ease-in-out z-20 hover:scale-110 focus-within:scale-110 focus-within:-translate-y-[250%]"
      >
        Job URL 🔗
      </Label>

      <div className="relative w-full mt-4">
        {/* Link Icon */}
        <FiLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-2xl" />

        {/* Input Field */}
        <Input
          id="job-url"
          type="text"
          placeholder="Enter job URL"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          onBlur={handleBlur}
          className="w-full pl-12 pr-4 py-5 text-blue-800 placeholder:text-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-400 rounded-2xl shadow-md focus:border-2 focus:border-blue-500 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Loading Indicator and Company Name */}
      {loading ? (
        <p className="mt-2 text-blue-600 font-medium animate-pulse flex items-center space-x-2">
          <span className="rounded-full w-2 h-2 bg-blue-600 animate-bounce mr-1"></span>
          <span>Fetching company name...</span>
        </p>
      ) : companyName ? (
        <p className="mt-2 text-lg font-semibold text-blue-700">
          Company: {companyName}
        </p>
      ) : null}
    </div>
  );
};

export default JobURLField;
