
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UploadDataPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload logic here
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload Medical Data</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Share your medical records securely</CardDescription>
            </div>
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Drag and drop files here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: PDF, JPG, PNG, DICOM
              </p>
              
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="default" size="default">
                    Browse Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Upload Guidelines</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Files must be less than 50MB</li>
              <li>Personal information should be clearly visible</li>
              <li>Ensure document quality is readable</li>
              <li>Your uploads are encrypted and secure</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Documents you've recently added</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No recent uploads to display.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDataPage;
