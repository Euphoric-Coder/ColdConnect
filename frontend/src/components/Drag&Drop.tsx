// ResumeUpload.tsx
import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

type ResumeUploadProps = {
  onFileSelect: (file: File | null) => void;
};

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="relative mt-4">
      <label
        htmlFor="resume"
        className={`flex flex-col items-center justify-center w-full h-40 px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-lg cursor-pointer transition-all duration-300 ease-in-out transform ${
          isDragging
            ? "border-4 border-dashed border-white scale-105"
            : "hover:scale-105 hover:shadow-2xl"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <AiOutlineCloudUpload className="text-5xl mb-3 text-white opacity-90 transition-opacity duration-200" />
        <span className="font-semibold text-lg text-white">
          Drag & Drop or Click to Upload Your Resume (PDF only)
        </span>
        <span className="text-sm text-white opacity-80">
          Max file size: 2 MB
        </span>
        <input
          id="resume"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ResumeUpload;
