
import React from 'react';
import { AlertCircle, MessageSquare, FileQuestion, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SupportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our team</CardDescription>
              </div>
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <input type="text" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" placeholder="What do you need help with?" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" rows={4} placeholder="Describe your issue in detail..."></textarea>
              </div>
              
              <div className="flex justify-end">
                <Button>Submit Request</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </div>
              <FileQuestion className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-medium flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  How secure is my health data?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your health data is encrypted and stored securely on our blockchain infrastructure, ensuring maximum privacy and security.
                </p>
              </div>
              
              <div className="border-b pb-3">
                <h3 className="font-medium flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Who can access my medical records?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Only healthcare providers you explicitly grant permission to can access your medical records.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  How do I share my records with a new doctor?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use the Access Management section to grant specific access to healthcare providers.
                </p>
              </div>
              
              <div className="mt-4">
                <a href="#" className="text-primary hover:underline text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  View all FAQs
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>Track your support requests</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              You have no active support tickets.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>Guides and resources</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium">Getting Started Guide</h3>
              <p className="text-sm text-muted-foreground mt-1">Learn the basics of using HealthChain</p>
            </div>
            
            <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium">Privacy & Security</h3>
              <p className="text-sm text-muted-foreground mt-1">Understanding data protection measures</p>
            </div>
            
            <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium">Digital Health Records</h3>
              <p className="text-sm text-muted-foreground mt-1">Managing your electronic health records</p>
            </div>
            
            <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h3 className="font-medium">Blockchain Technology</h3>
              <p className="text-sm text-muted-foreground mt-1">How blockchain secures your health data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;
