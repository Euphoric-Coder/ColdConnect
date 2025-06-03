import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkIcon, Send, RotateCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import StepCard from '../components/StepCard';
import FileUpload from '../components/FileUpload';
import EmailPreview from '../components/EmailPreview';

const GeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobUrl, setJobUrl] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const jobUrlRef = useRef<HTMLInputElement>(null);

  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    jobTitle: '',
    company: '',
  });

  const handleJobUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setJobUrl(url);
    
    if (url) {
      try {
        const formData = new FormData();
        formData.append('job_url', url);

        const response = await fetch('http://localhost:8900/fetch-company-name', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch company name');
        }

        const data = await response.json();
        if (data.company_name) {
          setEmailData(prev => ({ ...prev, company: data.company_name }));
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }

      setActiveStep(2);
    }
  };

  const handleResumeUpload = (file: File) => {
    setResume(file);
    setActiveStep(3);
  };

  const handlePasteUrl = () => {
    navigator.clipboard.readText().then(text => {
      if (text && jobUrlRef.current) {
        jobUrlRef.current.value = text;
        setJobUrl(text);
        setActiveStep(2);
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
  };

  const handleGenerateEmail = async () => {
    if (!jobUrl || !resume) {
      setError('Please provide both job URL and resume');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('job_url', jobUrl);
      formData.append('resume', resume);

      const response = await fetch('http://localhost:8900/generate-email', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setEmailData(prev => ({
        ...prev,
        subject: data.subject,
        content: data.body,
      }));

      setIsGenerated(true);
    } catch (error) {
      console.error('Error generating email:', error);
      setError('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewFullEmail = () => {
    navigate('/preview', { state: { emailData } });
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1
            className="font-heading font-bold text-3xl md:text-4xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Generate Your Cold Email
          </motion.h1>
          <motion.p
            className="text-dark-600 dark:text-dark-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Follow these steps to create a personalized cold email for your job application
          </motion.p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {/* Step 1: Enter Job URL */}
            <StepCard 
              number={1} 
              title="Enter the Job URL" 
              active={activeStep === 1}
              completed={jobUrl !== ''}
            >
              <div className="relative">
                <input
                  ref={jobUrlRef}
                  type="url"
                  className="form-input pr-24"
                  placeholder="https://company.com/jobs/position"
                  value={jobUrl}
                  onChange={handleJobUrlChange}
                />
                <button
                  onClick={handlePasteUrl}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-1 text-sm font-medium"
                >
                  Paste URL
                </button>
              </div>
              <p className="text-sm text-dark-500 dark:text-dark-400 mt-2">
                Add the link to the job listing you want to apply for
              </p>
            </StepCard>
            
            {/* Step 2: Upload Resume */}
            <StepCard 
              number={2} 
              title="Upload Your Resume" 
              active={activeStep === 2}
              completed={resume !== null}
            >
              <FileUpload 
                onFileSelect={handleResumeUpload}
                accept=".pdf"
                label="Upload your resume (PDF)"
              />
              <p className="text-sm text-dark-500 dark:text-dark-400 mt-2">
                We'll extract key information from your resume to personalize your email
              </p>
            </StepCard>
            
            {/* Step 3: Generate Email */}
            <StepCard 
              number={3} 
              title="Generate Cold Email" 
              active={activeStep === 3}
              completed={isGenerated}
            >
              <div className="space-y-4">
                <div className="flex flex-col items-center py-4">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={isGenerating ? RotateCw : isGenerated ? CheckCircle : Send}
                    onClick={handleGenerateEmail}
                    disabled={!jobUrl || !resume || isGenerating}
                    className={isGenerating ? 'animate-spin' : ''}
                  >
                    {isGenerating ? 'Generating...' : isGenerated ? 'Email Generated!' : 'Generate Cold Email'}
                  </Button>
                  
                  {!jobUrl || !resume ? (
                    <p className="text-sm text-dark-500 dark:text-dark-400 mt-4">
                      Please complete steps 1 and 2 before generating your email
                    </p>
                  ) : (
                    <p className="text-sm text-dark-500 dark:text-dark-400 mt-4">
                      Click to generate a personalized cold email based on the job posting and your resume
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-error-500 text-sm text-center">{error}</p>
                )}

                {isGenerated && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Recipient Email (optional)
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="hiring@company.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </StepCard>
          </div>
          
          {/* Email Preview */}
          {isGenerated && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Your Generated Email</h2>
              
              <EmailPreview
                subject={emailData.subject}
                content={emailData.content}
                jobTitle={emailData.jobTitle}
                company={emailData.company}
                recipientEmail={recipientEmail}
              />
              
              <div className="flex justify-center mt-6">
                <Button
                  variant="secondary"
                  icon={LinkIcon}
                  onClick={handleViewFullEmail}
                >
                  View Full Email
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;