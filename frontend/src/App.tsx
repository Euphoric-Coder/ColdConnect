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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import Typewriter from "typewriter-effect";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const App: React.FC = () => {
  const [jobUrl, setJobUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [emailContent, setEmailContent] = useState({ subject: "", body: "" });
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editedBody, setEditedBody] = useState(emailContent.body);
  const [editedSubject, setEditedSubject] = useState(emailContent.subject);

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
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setEmailContent(response.data);
      setEditedBody(response.data.body);
      setEditedSubject(response.data.subject);
    } catch (error) {
      console.error("Error generating email:", error);
      alert("Failed to generate email.");
    }
  };

  const sendMail = async () => {
    if (recipients.length === 0) {
      alert("Please add at least one recipient email address.");
      return;
    }

    const formData = new FormData();
    formData.append("recipient_email", recipients.join(","));
    formData.append("subject", editedSubject);
    formData.append("body", editedBody);

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

  const copyToClipboard = () => {
    const textarea = document.createElement("textarea");
    textarea.value = emailContent.body;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
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
      {emailContent.subject && (
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
              <h4 className="text-xl font-bold text-blue-800">
                Subject: {emailContent.subject}
              </h4>
              <ReactQuill
                value={emailContent.body}
                readOnly={true}
                theme="bubble"
                className="bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-300 max-h-96 overflow-y-auto"
              />

              {/* Send and Edit Buttons */}
              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={sendMail}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 shadow-lg text-lg font-semibold rounded-full"
                >
                  Send Email
                </Button>
                <Button
                  onClick={() => setShowEditor(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-blue-400 hover:from-blue-400 hover:to-teal-500 shadow-lg text-lg font-semibold rounded-full"
                >
                  Edit Email
                </Button>
              </div>

              {/* Rich Text Editor Dialog */}
              <Dialog open={showEditor} onOpenChange={setShowEditor}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Email Content</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Label
                      htmlFor="edited-subject"
                      className="text-lg font-semibold text-blue-900"
                    >
                      Subject
                    </Label>
                    <Input
                      id="edited-subject"
                      type="text"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="w-full bg-blue-50 text-blue-800 placeholder-blue-300 border border-blue-300 focus:ring-2 focus:ring-teal-400 rounded-lg p-3 shadow-md"
                    />
                    <Label
                      htmlFor="email-body-editor"
                      className="text-lg font-semibold text-blue-900"
                    >
                      Email Content
                    </Label>
                    <ReactQuill
                      id="email-body-editor"
                      theme="snow"
                      value={editedBody}
                      onChange={setEditedBody}
                      className="bg-white rounded-lg shadow-md max-h-96 overflow-y-auto"
                    />
                    <Button
                      className="w-full mt-4 py-3 bg-gradient-to-r from-teal-500 to-blue-400 hover:from-blue-400 hover:to-teal-500 shadow-lg text-lg font-semibold rounded-full"
                      onClick={() => {
                        setShowEditor(false);
                        setEmailContent({
                          subject: editedSubject,
                          body: editedBody,
                        });
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={sendMail}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 shadow-lg text-lg font-semibold rounded-full"
                    >
                      Send Email
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
