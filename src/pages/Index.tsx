
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Database, Lock, Clock, FileText, RefreshCw, FileLock2, Heart, Stethoscope, LockKeyhole } from "lucide-react";
import Navbar from "@/components/ehr/auth/Navbar";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Secure <span className="gradient-text">Blockchain-Based</span> Medical Records
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                HealthChain revolutionizes healthcare record management with secure blockchain technology, 
                giving patients control over their health data while ensuring providers have access
                to critical information when needed.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={() => navigate('/ehr/login')}
                  className="gradient-blue text-white text-lg py-6 px-8 hover:opacity-90"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-primary border-primary text-lg py-6 px-8"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-5 aspect-h-3 rounded-lg overflow-hidden shadow-xl bg-white p-2">
                <img
                  src="/placeholder.svg"
                  alt="HealthChain Dashboard"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-lg shadow-lg">
                <Shield className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose HealthChain?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our platform offers significant advantages over traditional healthcare record systems
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="h-10 w-10 text-primary" />,
                title: "Enhanced Security",
                description:
                  "End-to-end encryption and blockchain technology ensure your medical data is secure and tamper-proof.",
              },
              {
                icon: <Clock className="h-10 w-10 text-primary" />,
                title: "Instant Access",
                description:
                  "Access your medical records instantly, anytime and anywhere, eliminating delays in care.",
              },
              {
                icon: <RefreshCw className="h-10 w-10 text-primary" />,
                title: "Seamless Sharing",
                description:
                  "Share your medical history with healthcare providers securely and effortlessly.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="relative p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full shadow-md">
                  {feature.icon}
                </div>
                <h3 className="mt-8 text-xl font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Traditional vs. HealthChain
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              See how our blockchain-based system compares to traditional record keeping
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-gray-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-700">Traditional System</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Paper records can be lost, damaged, or destroyed",
                  "Limited access during emergencies",
                  "Fragmented records across different providers",
                  "Delays in sharing information between facilities",
                  "Privacy concerns with physical record handling",
                  "Difficult to track who accessed your information",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">✖</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow">
              <div className="flex items-center mb-6">
                <FileLock2 className="h-8 w-8 text-primary mr-4" />
                <h3 className="text-2xl font-bold text-primary">HealthChain</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Digital records secured with blockchain technology",
                  "Immediate access 24/7 from any device",
                  "Comprehensive unified health record",
                  "Instant secure sharing with authorized providers",
                  "Advanced encryption protects sensitive information",
                  "Detailed audit trail of all record access",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Who Uses HealthChain?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our platform serves both patients and healthcare providers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center p-8 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="inline-block p-4 bg-medical-lightest rounded-full mb-6">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Patients</h3>
              <p className="text-gray-600 mb-6">
                Access your complete medical history, control who can view your records,
                and seamlessly share information with new healthcare providers.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/ehr/login')}
                className="text-primary border-primary"
              >
                Patient Login
              </Button>
            </div>

            <div className="text-center p-8 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="inline-block p-4 bg-medical-lightest rounded-full mb-6">
                <Stethoscope className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Providers</h3>
              <p className="text-gray-600 mb-6">
                Get instant access to patient records with permission, see comprehensive
                medical histories, and update records securely with blockchain verification.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/ehr/login')}
                className="text-primary border-primary"
              >
                Provider Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-8">
            Ready to transform how you manage health records?
          </h2>
          <Button
            onClick={() => navigate('/ehr/login')}
            className="bg-white text-primary hover:bg-gray-100 text-lg py-6 px-8"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
                <LockKeyhole className="h-5 w-5 text-primary" />
              </div>
              <span className="ml-2 text-xl font-semibold">HealthChain</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} HealthChain. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
