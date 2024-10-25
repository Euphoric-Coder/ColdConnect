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
import { Textarea } from "./components/ui/textarea";
import { TiClipboard } from "react-icons/ti";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black text-white flex flex-col items-center justify-center px-5 py-16 space-y-16">
      {/* Header Section */}
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold drop-shadow-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">
          📧 Cold Mail Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-300 tracking-wide opacity-80">
          Create professional cold emails tailored to your job application.
        </p>
      </header>

      {/* Main Form Section */}
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left Side - Typewriter Text */}
        <div className="flex flex-col justify-center space-y-8 text-center md:text-left">
          <h2 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            <Typewriter
              options={{
                strings: [
                  "Ready to Ace Your Job Application?",
                  "Let us generate the perfect cold email for you.",
                  "Stand out from the crowd!",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
          <p className="text-lg text-gray-300 tracking-wider">
            With our Cold Mail Generator, you can create professional, tailored
            cold emails in just a few clicks. Enter the job URL and upload your
            resume to get started!
          </p>
        </div>

        {/* Right Side - Form Section */}
        <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border border-white/10 shadow-2xl rounded-3xl transition-all transform hover:scale-105 duration-300 ease-in-out">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-4xl font-bold text-white">
              Get Started
            </CardTitle>
            <CardDescription className="mt-2 text-white/80">
              Enter the job URL and upload your resume to generate a cold email.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 py-8 space-y-8">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="job-url"
                  className="text-xl font-semibold text-white"
                >
                  Job URL
                </Label>
                <Input
                  id="job-url"
                  type="text"
                  placeholder="https://jobs.example.com"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full mt-2 bg-white/10 text-white placeholder-white/50 border border-white/20 focus:ring-2 focus:ring-blue-400 rounded-lg p-4 shadow-lg"
                />
              </div>
              <div>
                <Label
                  htmlFor="resume"
                  className="text-xl font-semibold text-white"
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
                  className="w-full mt-2 bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 rounded-lg p-4 shadow-lg"
                />
              </div>
              <Button
                className="w-full py-4 mt-6 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:to-blue-600 shadow-lg text-xl font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl"
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
        <section className="w-full max-w-5xl space-y-6">
          <h3 className="text-3xl font-bold text-center">
            Your Generated Cold Email
          </h3>
          <Card className="bg-white/10 text-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl">
            <CardHeader className="p-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 flex justify-between items-center">
              <CardTitle className="text-3xl font-bold text-white">
                Cold Email
              </CardTitle>
              <Button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg text-sm font-semibold"
              >
                <TiClipboard className="h-5 w-5" />
                <span>Copy Email</span>
              </Button>
            </CardHeader>
            <CardContent className="p-6 max-h-96 overflow-y-auto text-white text-opacity-90">
              <div className="bg-gray-900 p-6 rounded-lg shadow-inner border border-white/20">
                <div className="mb-6 space-y-2">
                  <p className="text-sm font-semibold text-gray-300">
                    <span className="text-white">From:</span> Your Name
                    (your-email@example.com)
                  </p>
                  <p className="text-sm font-semibold text-gray-300">
                    <span className="text-white">To:</span> Hiring Manager
                    (manager@example.com)
                  </p>
                  <p className="text-sm font-semibold text-gray-300">
                    <span className="text-white">Subject:</span> Application for
                    [Job Title]
                  </p>
                </div>
                <Textarea
                  readOnly
                  className="w-full h-64 bg-white/10 p-4 rounded-lg border border-white/20 shadow-inner whitespace-pre-wrap"
                  value={emailContent}
                />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer Section */}
      <footer className="text-center text-sm text-white/60 py-12">
        &copy; {new Date().getFullYear()} Cold Mail Generator. All rights
        reserved.
      </footer>
    </div>
  );
};

export default App;
