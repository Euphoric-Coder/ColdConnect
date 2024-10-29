import React, { useState, useRef, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import Typewriter from "typewriter-effect";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { AiOutlineExpand, AiOutlineLoading3Quarters } from "react-icons/ai";
import ResumeUpload from "./components/Drag&Drop";
import JobURLField from "./components/JobURLField";
import HeroSection from "./components/Hero";

const App: React.FC = () => {
  const [jobUrl, setJobUrl] = useState("");
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [emailContent, setEmailContent] = useState({ subject: "", body: "" });
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showExpandedPreview, setShowExpandedPreview] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const [editedBody, setEditedBody] = useState(emailContent.body);
  const [editedSubject, setEditedSubject] = useState(emailContent.subject);

  // For loading state
  const [loading, setLoading] = useState(false);

  // For loading text state
  const [loadingText, setLoadingText] = useState("Generating");

  // Ref for the end of the Generated Cold Mail Section
  const endOfEmailRef = useRef<HTMLDivElement | null>(null);

  const handleFileSelect = (file: File | null) => {
    setResumeFile(file);
  };

  const handleSubmit = async () => {
    if (!resumeFile || !jobUrl) {
      alert("Please upload a resume and provide a job link.");
      return;
    }

    // Start loading
    setLoading(true);

    const formData = new FormData();
    formData.append("job_url", jobUrl);
    formData.append("resume", resumeFile);

    try {
      const response = await axios.post(
        "http://localhost:8900/generate-email",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setEmailContent(response.data);
      setEditedBody(response.data.body);
      setEditedSubject(response.data.subject);
      console.log(companyName);
      // Scroll to the generated email section
      setTimeout(() => {
        endOfEmailRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } catch (error) {
      console.error("Error generating email:", error);
      alert("Failed to generate email.");
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  const sendMail = async () => {
    if (recipients.length === 0) {
      setShowSendDialog(true);
      return;
    }

    const formData = new FormData();
    formData.append("recipient_email", recipients.join(","));
    formData.append("subject", editedSubject);
    formData.append("body", emailContent.body);
    console.log(emailContent.body);
    try {
      await axios.post("http://localhost:8900/send-email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email: " + error);
    }
  };

  const addOrUpdateRecipientEmail = () => {
    if (recipientEmail) {
      if (editIndex !== null) {
        const updatedRecipients = [...recipients];
        updatedRecipients[editIndex] = recipientEmail;
        setRecipients(updatedRecipients);
        setEditIndex(null);
      } else {
        setRecipients([...recipients, recipientEmail]);
      }
      setRecipientEmail("");
    }
  };

  const editRecipient = (index: number) => {
    setRecipientEmail(recipients[index]);
    setEditIndex(index);
  };

  const deleteRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    const textarea = document.createElement("textarea");
    textarea.value = emailContent.body;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Cold email copied to clipboard!");
  };

  useEffect(() => {
    if (loading) {
      const loadingInterval = setInterval(() => {
        setLoadingText((prev) => {
          if (prev === "Generating...") return "Generating";
          else return prev + ".";
        });
      }, 500);

      return () => clearInterval(loadingInterval);
    }
  }, [loading]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-indigo-100 text-gray-900 flex flex-col items-center justify-center px-5 py-16 space-y-1 overflow-hidden">
      {/* Floating Pulsing Circles */}
      <div className="absolute top-12 left-12 w-44 h-44 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full filter blur-2xl opacity-60 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-br from-indigo-200 to-blue-300 rounded-full filter blur-3xl opacity-50 animate-pulse-slower"></div>
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full filter blur-2xl opacity-40 animate-pulse-slow"></div>

      {/* Soft Background Accents */}
      <div className="absolute top-1/2 left-2/3 w-36 h-36 bg-gradient-to-br from-teal-100 to-indigo-200 rounded-full filter blur-3xl opacity-50 animate-pulse-slowest"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-100 to-teal-200 rounded-full filter blur-3xl opacity-45 animate-pulse-slower"></div>

      {/* Header Section */}
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 hover:bg-gradient-to-l transition-colors duration-500 ease-in-out">
          📧 Cold Mail Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-800 opacity-90">
          Generate professional cold emails tailored to your job application.
        </p>
      </header>

      <HeroSection />
      
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
      <Card className="w-full bg-white/5 backdrop-blur-md border border-blue-300 shadow-2xl rounded-2xl">
        <CardHeader className="text-center py-6">
          <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-teal-400 to-blue-500">
            Get Started
          </CardTitle>
          <CardDescription className="mt-2 text-blue-700 opacity-90 text-md">
            Enter the job URL and upload your resume to generate a cold email.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-6 space-y-6">
          <div className="space-y-6">
            {/* The Job URL Field  */}
            <JobURLField
              jobUrl={jobUrl}
              setJobUrl={setJobUrl}
              companyName={companyName}
              setCompanyName={setCompanyName}
            />

            {/* The Resume Upload field (.pdf only) */}
            <ResumeUpload onFileSelect={handleFileSelect} />

            <button
              onClick={handleSubmit}
              className={`w-full py-4 mt-6 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 shadow-lg text-xl font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
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
            </button>
          </div>
        </CardContent>
      </Card>
      </main>

      {/* Generated Cold Mail Section */}
      {emailContent.subject && (
        <section className="w-full max-w-7xl space-y-8">
          <h3
            className="mt-16 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500"
            id="cold-preview"
          >
            Generated Cold Email {(companyName)? `for ${companyName}` : ""}
          </h3>
          <Card className="bg-blue-100 text-blue-900 rounded-3xl shadow-2xl transition-all duration-500 ease-in-out transform hover:shadow-2xl">
            <CardHeader className="p-6 bg-gradient-to-r from-blue-200 via-teal-100 to-blue-300 flex justify-between items-center rounded-t-3xl">
              <CardTitle className="text-3xl font-bold text-blue-900">
                Cold Email Preview
              </CardTitle>
              <div className="flex items-center">
                <Button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 bg-teal-400 hover:bg-teal-500 py-2 px-4 rounded-lg text-sm font-semibold"
                >
                  Copy Email
                  {/* Scrolls down for a better view of the generated cold mail */}
                  <div ref={endOfEmailRef}></div>
                </Button>
                <AiOutlineExpand
                  className="ml-4 cursor-pointer text-xl text-blue-400 hover:text-blue-900 hover:animate-pulse"
                  onClick={() => setShowExpandedPreview(true)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4 bg-blue-50 rounded-b-3xl ">
              <h4 className="text-2xl font-bold text-blue-800">
                Subject: {emailContent.subject}
              </h4>
              <ReactQuill
                value={emailContent.body}
                readOnly={true}
                theme="bubble"
                className="custom-quill-preview bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-300 overflow-auto"
              />
              {/* Send and Edit Buttons */}
              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={() => setShowSendDialog(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 shadow-lg text-lg font-semibold rounded-full"
                >
                  Send Email
                </Button>
                <Button
                  onClick={() => setShowEditorDialog(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-blue-400 hover:from-blue-400 hover:to-teal-500 shadow-lg text-lg font-semibold rounded-full"
                >
                  Edit Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Expanded Cold Email Preview Dialog */}
      <Dialog open={showExpandedPreview} onOpenChange={setShowExpandedPreview}>
        <DialogContent className="max-h-[80vh] overflow-auto max-w-5xl expanded-preview-dialog">
          <DialogHeader>
            <DialogTitle className="text-4xl">
              Full Cold Email Preview
            </DialogTitle>
          </DialogHeader>
          <ReactQuill
            value={emailContent.body}
            readOnly={true}
            theme="bubble"
            className="bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-300"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Email Dialog */}
      <Dialog open={showEditorDialog} onOpenChange={setShowEditorDialog}>
        <DialogContent className="max-w-6xl mx-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit Cold Email</DialogTitle>
          </DialogHeader>
          <span className="inline-flex items-center gap-3 ">
            <Label
              htmlFor="subject"
              className="text-lg font-semibold text-blue-900"
            >
              Subject:
            </Label>
            <Input
              id="subject"
              type="text"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              className="w-full mb-4 mt-2 bg-blue-50 text-blue-800 placeholder-blue-300 border border-blue-300 focus:ring-2 focus:ring-teal-400 rounded-lg p-4 shadow-md"
            />
          </span>
          <div className="rounded-lg border border-blue-300 shadow-md">
            <ReactQuill
              value={editedBody}
              onChange={setEditedBody}
              theme="snow"
              className="custom-quill-editor p-3 rounded-lg overflow-auto"
            />
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            <Button
              onClick={() => setShowEditorDialog(false)}
              className="bg-gray-400 text-white rounded-lg px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setEmailContent({ subject: editedSubject, body: editedBody });
                setShowEditorDialog(false);
              }}
              className="bg-blue-500 text-white rounded-lg px-4 py-2"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Recipient Emails</DialogTitle>
            <DialogDescription>
              Add email addresses to the recipient list. You can edit or delete
              them as needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter recipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full mt-2 bg-blue-50 text-blue-800 placeholder-blue-300 border border-blue-300 focus:ring-2 focus:ring-teal-400 rounded-lg p-4 shadow-md"
            />
            <Button
              className="w-full mt-4 py-2 bg-teal-400 text-white rounded-md"
              onClick={addOrUpdateRecipientEmail}
            >
              {editIndex !== null ? "Update Email" : "Add Email"}
            </Button>
            <div className="space-y-2 mt-4">
              <h4 className="text-lg font-semibold text-blue-900">
                Recipient List
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-blue-700">
                {recipients.map((email, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {email}
                    <div className="flex space-x-2">
                      <Button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => editRecipient(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="text-sm text-red-600 hover:text-red-800"
                        onClick={() => deleteRecipient(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 shadow-lg text-lg font-semibold rounded-full"
              onClick={() => {
                sendMail();
                setShowSendDialog(false);
              }}
            >
              Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer Section */}
      <footer className="text-center text-sm text-blue-700 py-12">
        &copy; {new Date().getFullYear()} Cold Mail Generator. All rights
        reserved.
      </footer>
    </div>
  );
};

export default App;
