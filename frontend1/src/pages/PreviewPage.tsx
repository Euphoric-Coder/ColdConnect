import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import EmailPreview from '../components/EmailPreview';

interface EmailData {
  subject: string;
  content: string;
  jobTitle?: string;
  company?: string;
}

const PreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract email data from location state or use default data
  const emailData = location.state?.emailData as EmailData || {
    subject: 'Application for Software Developer Position at TechCorp',
    content: `Dear Hiring Manager,

I hope this email finds you well. I recently came across the Software Developer position at TechCorp on your careers page and I'm excited to submit my application for consideration.

With 5+ years of experience in full-stack development, I've worked extensively with React, Node.js, and AWS – technologies I noticed are key requirements in your job posting. In my current role at DevCompany, I've led the development of scalable web applications that have improved user engagement by 35%.

Some relevant achievements:
• Reduced API response times by 60% through implementation of efficient caching strategies
• Developed a component library that improved team productivity by 25%
• Mentored junior developers and implemented code review practices that reduced bugs in production by 40%

I'm particularly drawn to TechCorp's mission to make technology accessible to underserved communities, and I'd be thrilled to contribute my technical skills to such meaningful work.

I've attached my resume for your review and would welcome the opportunity to discuss how my background aligns with your team's needs. Please feel free to contact me at your convenience to arrange a conversation.

Thank you for considering my application.

Best regards,
Alex Johnson`,
    jobTitle: 'Software Developer',
    company: 'TechCorp',
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRegenerateEmail = () => {
    navigate('/generator');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={handleBackClick}
            className="mb-6"
          >
            Back
          </Button>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-8">Email Preview</h1>
            
            <EmailPreview
              subject={emailData.subject}
              content={emailData.content}
              jobTitle={emailData.jobTitle}
              company={emailData.company}
              onEdit={handleRegenerateEmail}
            />
            
            <div className="mt-12 bg-dark-50 dark:bg-dark-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Tips for Sending Your Cold Email</h3>
              <ul className="list-disc list-inside space-y-2 text-dark-600 dark:text-dark-300">
                <li>Personalize the subject line with the specific job title</li>
                <li>Address the hiring manager by name if possible</li>
                <li>Send your email during business hours for better visibility</li>
                <li>Follow up after 5-7 business days if you don't receive a response</li>
                <li>Check for any grammatical errors or typos before sending</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;