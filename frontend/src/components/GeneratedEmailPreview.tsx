import React from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import {
  AiOutlineExpand,
  AiOutlineLoading3Quarters,
  AiOutlineMail,
  AiOutlineEdit,
} from "react-icons/ai";
import ReactQuill from "react-quill";

interface GeneratedEmailPreviewProps {
  emailContent: { subject: string; body: string };
  companyName?: string | null;
  copyToClipboard: () => void;
  setShowExpandedPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSendDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditorDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const GeneratedEmailPreview: React.FC<GeneratedEmailPreviewProps> = ({
  emailContent,
  companyName,
  copyToClipboard,
  setShowExpandedPreview,
  setShowSendDialog,
  setShowEditorDialog,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto space-y-14 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <h3
        className="mt-12 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600"
        id="cold-preview"
      >
        Generated Cold Email {companyName ? `for ${companyName}` : ""}
      </h3>

      <Card className="relative bg-gradient-to-br from-blue-50 via-teal-50 to-indigo-50 text-blue-900 rounded-3xl shadow-2xl transition-transform duration-500 ease-in-out hover:shadow-xl hover:scale-105 p-8">
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-3">
          {/* Copy Button */}
          <Button
            onClick={copyToClipboard}
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 p-3 rounded-full text-white shadow-lg transform transition duration-300 hover:scale-110"
            title="Copy Email"
          >
            <AiOutlineLoading3Quarters className="text-xl" />
          </Button>

          {/* Expand Button */}
          <Button
            onClick={() => setShowExpandedPreview(true)}
            className="flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400 p-3 rounded-full text-white shadow-lg transform transition duration-300 hover:scale-110"
            title="Expand Email"
          >
            <AiOutlineExpand className="text-xl" />
          </Button>

          {/* Send Email Button */}
          <Button
            onClick={() => setShowSendDialog(true)}
            className="flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-600 hover:to-green-500 p-3 rounded-full text-white shadow-lg transform transition duration-300 hover:scale-110"
            title="Send Email"
          >
            <AiOutlineMail className="text-xl" />
          </Button>

          {/* Edit Email Button */}
          <Button
            onClick={() => setShowEditorDialog(true)}
            className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 p-3 rounded-full text-white shadow-lg transform transition duration-300 hover:scale-110"
            title="Edit Email"
          >
            <AiOutlineEdit className="text-xl" />
          </Button>
        </div>

        <CardHeader className="text-center mb-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-wide">
            Cold Email Preview
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 bg-white/90 p-8 rounded-2xl shadow-inner border border-blue-200">
          <h4 className="text-xl sm:text-2xl font-semibold text-blue-800">
            Subject: {emailContent.subject}
          </h4>
          <ReactQuill
            value={emailContent.body}
            readOnly
            theme="bubble"
            className="custom-quill-preview p-6 rounded-lg shadow-lg border border-blue-300 bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100 max-h-96 overflow-auto"
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default GeneratedEmailPreview;
