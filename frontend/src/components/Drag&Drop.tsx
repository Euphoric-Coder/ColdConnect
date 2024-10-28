import React, { useState, useCallback } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileSelect }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        setResumeFile(file);
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    },
    [onFileSelect]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      onFileSelect(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  return (
    <div className="mt-6">
      <label className="block text-lg font-semibold text-blue-900 mb-2">
        Upload Resume
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-xl cursor-pointer transition-all ${
          isDragging
            ? "border-blue-600 bg-gradient-to-br from-blue-100 to-blue-200"
            : "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100"
        } shadow-md hover:shadow-lg`}
      >
        <FiUploadCloud className="text-blue-600 text-6xl mb-4" />
        <div className="text-center">
          {resumeFile ? (
            <p className="text-base font-semibold text-blue-900">
              {resumeFile.name}{" "}
              <span className="text-green-600 font-semibold">(Selected)</span>
            </p>
          ) : (
            <p className="text-blue-800 text-lg font-semibold">
              Drag & Drop your resume here
            </p>
          )}
          <p className="text-md text-blue-500 mt-1">
            or click to browse files
          </p>
        </div>

        <Label
          htmlFor="resume-upload"
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />
      </div>
    </div>
  );
};

export default ResumeUpload;
