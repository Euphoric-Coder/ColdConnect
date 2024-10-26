import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

import Typewriter from "typewriter-effect";

const App: React.FC = () => {
  const [jobUrl, setJobUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [emailContent, setEmailContent] = useState("");

  const handleSubmit = async () => {
    if (!resumeFile || !jobUrl) {
      alert("Please upload a resume and provide a job link.");
      return;
    }

    const formData = new FormData();
    formData.append("job_url", jobUrl);
    formData.append("resume", resumeFile);

    try {
      const response = await axios.post(
        "http://localhost:8900/generate-email",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEmailContent(response.data.email);
    } catch (error) {
      console.error("Error generating email:", error);
      alert("Failed to generate email.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    alert("Cold email copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-teal-100 text-gray-900 flex flex-col items-center justify-center px-5 py-16 space-y-16">
      {/* Header Section */}
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500">
          📧 Cold Mail Generator
        </h1>
        <p className="text-lg md:text-xl text-blue-800 opacity-90">
          Generate professional cold emails tailored to your job application.
        </p>
      </header>

      {/* Main Form Section */}
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left Side - Typewriter Text */}
        <div className="flex flex-col justify-center space-y-8 text-center md:text-left">
          <h2 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-600">
            <Typewriter
              options={{
                strings: [
                  "Ready to Ace Your Job Application?",
                  "Generate the perfect cold email.",
                  "Stand out from the crowd!",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
          <p className="text-lg text-blue-800 opacity-80">
            Use our Cold Mail Generator to create customized, professional
            emails in a few clicks. Enter the job URL and upload your resume to
            get started.
          </p>
        </div>

        {/* Right Side - Form Section */}
        <Card className="w-full bg-white/20 backdrop-blur-md border border-blue-300 shadow-2xl rounded-lg transition-all transform hover:scale-105 duration-300 ease-in-out">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-teal-400 to-blue-500">
              Get Started
            </CardTitle>
            <CardDescription className="mt-2 text-blue-700 opacity-90">
              Enter the job URL and upload your resume to generate a cold email.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 py-6 space-y-6">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="job-url"
                  className="text-xl font-semibold text-blue-900"
                >
                  Job URL
                </Label>
                <Input
                  id="job-url"
                  type="text"
                  placeholder="https://jobs.example.com"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full mt-2 bg-blue-50 text-blue-800 placeholder-blue-300 border border-blue-300 focus:ring-2 focus:ring-teal-400 rounded-lg p-4 shadow-md"
                />
              </div>
              <div>
                <Label
                  htmlFor="resume"
                  className="text-xl font-semibold text-blue-900"
                >
                  Upload Resume
                </Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files) setResumeFile(e.target.files[0]);
                  }}
                  className="w-full mt-2 bg-blue-50 text-blue-800 border border-blue-300 focus:ring-2 focus:ring-teal-400 rounded-lg p-4 shadow-md"
                />
              </div>
              <Button
                className="w-full py-4 mt-6 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 shadow-lg text-xl font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl"
                onClick={handleSubmit}
              >
                Generate Cold Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Generated Cold Mail Section */}
      {emailContent && (
        <section className="w-full max-w-5xl space-y-8">
          <h3 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Generated Cold Email
          </h3>
          <Card className="bg-blue-100 text-blue-900 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl">
            <CardHeader className="p-6 bg-gradient-to-r from-blue-200 via-teal-100 to-blue-300 flex justify-between items-center rounded-t-3xl">
              <CardTitle className="text-3xl font-bold text-blue-900">
                Cold Email Preview
              </CardTitle>
              <Button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 bg-teal-400 hover:bg-teal-500 py-2 px-4 rounded-lg text-sm font-semibold"
              >
                <span>Copy Email</span>
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-4 bg-blue-50 rounded-b-3xl">
              <div className="bg-blue-100 p-6 rounded-lg shadow-inner border border-blue-300 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-700">
                    <span className="text-blue-900">From:</span> Your Name
                    (your-email@example.com)
                  </p>
                  <p className="text-sm font-semibold text-blue-700">
                    <span className="text-blue-900">To:</span> Hiring Manager
                    (manager@example.com)
                  </p>
                  <p className="text-sm font-semibold text-blue-700">
                    <span className="text-blue-900">Subject:</span> Application
                    for [Job Title]
                  </p>
                </div>
                <p className="text-blue-900 whitespace-pre-wrap leading-relaxed">
                  {emailContent}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer Section */}
      <footer className="text-center text-sm text-blue-700 py-12">
        &copy; {new Date().getFullYear()} Cold Mail Generator. All rights
        reserved.
      </footer>
    </div>
  );
};

export default App;
