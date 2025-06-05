import React, { useState, useEffect } from "react";
import axios from "axios";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import HeroSection from "../components/Hero";
import MainFormSection from "../components/GenerateEmailFormSection";
import AppTitle from "../components/AppTitle";
import GeneratedEmailPreview from "../components/GeneratedEmailPreview";
import { useAuth, useUser } from "@clerk/clerk-react";

const LandingPage: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const token = getToken();

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
  const [hasAddedUser, setHasAddedUser] = useState(false); // to avoid re-posting

  useEffect(() => {
    const addUser = async () => {
      if (isSignedIn && user && !hasAddedUser) {
        const token = await getToken();
        const formData = new FormData();
        formData.append("name", user.fullName || "");
        formData.append("email", user.primaryEmailAddress?.emailAddress || "");
        formData.append("user_id", user.id);

        await fetch("http://localhost:8900/add-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        setHasAddedUser(true);
      }
    };

    addUser();
  }, [isSignedIn, user, getToken, hasAddedUser]);

  // if (user === undefined) {
  //   return <div className="text-center p-10 text-xl">Loading...</div>;
  // }

  // For loading state
  const [loading, setLoading] = useState(false);

  // For loading text state
  const [loadingText, setLoadingText] = useState("Generating");

  const AddUser = async () => {
    const formData = new FormData();
    // @ts-expect-error // to be ignored
    formData.append("name", user?.fullName);
    // @ts-expect-error // to be ignored
    formData.append("email", user?.primaryEmailAddress?.emailAddress);
    // @ts-expect-error // to be ignored
    formData.append("user_id", user?.id);

    await fetch("http://localhost:8900/add-user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  };

  const handleFileSelect = (file: File | null) => {
    setResumeFile(file);
  };

  // Smooth scroll function to a specific id
  const handleScrollToSection = () => {
    const targetSection = document.getElementById("mail-preview");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
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
        `${import.meta.env.VITE_BACKEND_URL}/generate-email`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setEmailContent(response.data);
      setEditedBody(response.data.body);
      setEditedSubject(response.data.subject);
      console.log(resumeFile);
    } catch (error) {
      console.error("Error generating email:", error);
      alert("Failed to generate email.");
    } finally {
      // Stop loading
      setLoading(false);
      handleScrollToSection();
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
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/send-email`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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
    <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50 text-gray-900 flex flex-col items-center justify-center px-5 py-16 space-y-1 overflow-hidden">
      {/* Floating Pulsing Circles */}
      <div className="absolute top-12 left-12 w-44 h-44 bg-gradient-to-br from-blue-200 to-teal-400 rounded-full filter blur-2xl opacity-60 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full filter blur-3xl opacity-50 animate-pulse-slower"></div>
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full filter blur-2xl opacity-40 animate-pulse-slow"></div>

      {/* Soft Background Accents */}
      <div className="absolute top-1/2 left-2/3 w-36 h-36 bg-gradient-to-br from-teal-100 to-indigo-200 rounded-full filter blur-3xl opacity-50 animate-pulse-slowest"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-100 to-teal-200 rounded-full filter blur-3xl opacity-45 animate-pulse-slower"></div>

      {/* Title of the Cold-Mailing LandingPage: Cold Connect */}
      <AppTitle />

      <HeroSection />

      <div id="mail-generate">
        <MainFormSection
          jobUrl={jobUrl}
          setJobUrl={setJobUrl}
          companyName={companyName}
          setCompanyName={setCompanyName}
          handleFileSelect={handleFileSelect}
          handleSubmit={handleSubmit}
          loading={loading}
          loadingText={loadingText}
        />
      </div>

      {/* Generated Cold Mail Section */}
      {emailContent.subject && (
        <GeneratedEmailPreview
          emailContent={emailContent}
          companyName={companyName}
          copyToClipboard={copyToClipboard}
          setShowExpandedPreview={setShowExpandedPreview}
          setShowSendDialog={setShowSendDialog}
          setShowEditorDialog={setShowEditorDialog}
        />
      )}

      {/* Expanded Cold Email Preview Dialog */}
      <Dialog open={showExpandedPreview} onOpenChange={setShowExpandedPreview}>
        <DialogContent className="max-h-[85vh] overflow-auto max-w-6xl expanded-preview-dialog">
          <DialogHeader>
            <DialogTitle className="text-4xl">
              Full Cold Email Preview
            </DialogTitle>
          </DialogHeader>
          <ReactQuill
            value={emailContent.body}
            readOnly={true}
            theme="bubble"
            className="bg-blue-50 p-4 rounded-2xl shadow-inner border border-blue-300"
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
            <DialogTitle>
              Enter Recipient Emails (Still working on this feature....)
            </DialogTitle>
            <DialogDescription>
              Add email addresses to the recipient list. You can edit or delete
              them as needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              disabled
              type="email"
              placeholder="Enter recipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full mt-2 bg-blue-50 text-blue-800 placeholder-blue-300 border border-blue-300 focus:ring-2 focus:ring-teal-400 rounded-lg p-4 shadow-md"
            />
            <Button
              disabled
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
              disabled
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

export default LandingPage;
