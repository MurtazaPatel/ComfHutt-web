"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, UploadCloud, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  ownerDetailsSchema,
  propertyDetailsFormSchema,
  OwnerDetails,
  PropertyDetails,
} from "@/lib/validations/owner-onboarding";
import { readOnboardingPrefill } from "@/utils/onboarding";

const steps = [
  { id: 1, name: "Owner Details" },
  { id: 2, name: "Property Details" },
  { id: 3, name: "Documents" },
];

interface OnboardingFormProps {
  initialData?: {
    name: string;
    email: string;
  };
}

const OnboardingForm = ({ initialData }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Autosave simulation
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Forms
  const ownerForm = useForm<OwnerDetails>({
    resolver: zodResolver(ownerDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
    },
  });

  const propertyForm = useForm<PropertyDetails>({
    resolver: zodResolver(propertyDetailsFormSchema),
    mode: "onBlur",
  });

  // Load from local storage on mount
  useEffect(() => {
    const savedOwnerData = localStorage.getItem("onboarding_owner");
    const savedPropertyData = localStorage.getItem("onboarding_property");
    const savedStep = localStorage.getItem("onboarding_step");

    // Check for prefill data from marketplace
    const prefill = readOnboardingPrefill();

    if (savedOwnerData) {
      ownerForm.reset(JSON.parse(savedOwnerData));
    } else if (initialData) {
      // If no local storage, but we have auth data, use it
      ownerForm.reset({
        name: initialData.name,
        email: initialData.email,
        phone: "",
        address: "",
      });
    }

    if (prefill) {
      // If we have fresh prefill data, use it over saved data for property details
      propertyForm.reset({
        title: prefill.title || "",
        location: prefill.city || "",
        expectedValuation: prefill.valuation?.replace(/[^0-9]/g, '') || "", // Strip currency symbols
        type: "Apartment", // Default or map from prefill if available
        builtUpArea: "",
        carpetArea: ""
      });
       // If coming with prefill, maybe start at step 2 if owner info is present?
       // For now, let's keep it at step 1 to verify owner info.
    } else if (savedPropertyData) {
      propertyForm.reset(JSON.parse(savedPropertyData));
    }
    
    if (savedStep && !prefill) setCurrentStep(Number(savedStep));
  }, [ownerForm, propertyForm, initialData]);

  // Save to local storage on change
  useEffect(() => {
    const subscription = ownerForm.watch((value) => {
      localStorage.setItem("onboarding_owner", JSON.stringify(value));
      setLastSaved(new Date());
    });
    return () => subscription.unsubscribe();
  }, [ownerForm.watch]);

  useEffect(() => {
    const subscription = propertyForm.watch((value) => {
      localStorage.setItem("onboarding_property", JSON.stringify(value));
      setLastSaved(new Date());
    });
    return () => subscription.unsubscribe();
  }, [propertyForm.watch]);

   useEffect(() => {
      localStorage.setItem("onboarding_step", String(currentStep));
  }, [currentStep]);


  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await ownerForm.trigger();
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await propertyForm.trigger();
      if (isValid) setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Combine data
    const ownerData = ownerForm.getValues();
    const propertyData = propertyForm.getValues();
    
    // In a real app, we'd handle file uploads here (upload to S3/Blob storage first, get URLs)
    // For this demo, we assume files are handled or mocked.

    try {
      const response = await fetch("/api/owner-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: ownerData,
          property: propertyData,
          // mocked document URLs
          documents: [
            { type: "OWNERSHIP_PROOF", url: "https://example.com/doc1.pdf" },
             { type: "PHOTO", url: "https://example.com/photo1.jpg" }
          ]
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      setIsSuccess(true);
      
      // Analytics: Track successful submission
      if (typeof window !== "undefined" && (window as any).dataLayer) {
          (window as any).dataLayer.push({
              event: "owner_onboarding_submitted",
              location: "onboarding_form",
              timestamp: new Date().toISOString()
          });
      }
      console.log("[Analytics] owner_onboarding_submitted");

      localStorage.removeItem("onboarding_owner");
      localStorage.removeItem("onboarding_property");
      localStorage.removeItem("onboarding_step");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 bg-card rounded-xl shadow-lg border max-w-lg mx-auto">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Application Submitted!</h2>
          <p className="text-muted-foreground mt-2">
            Your property details have been received. Our onboarding team will contact you within 24-48 hours to proceed with verification.
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>Submit Another Property</Button>
      </div>
    );
  }

  const progress = ((currentStep - 1) / (steps.length)) * 100;

  return (
    <div id="onboarding-form" className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
           <span>Step {currentStep} of {steps.length}: {steps[currentStep-1].name}</span>
           <span className="text-xs">{lastSaved ? `Autosaved` : ""}</span>
        </div>
        <Progress value={progress + 33} className="h-2" />
      </div>

      <Card className="border-muted shadow-lg">
        <CardHeader>
           <CardTitle>{steps[currentStep - 1].name}</CardTitle>
           <CardDescription>Please fill in the details below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: OWNER DETAILS */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...ownerForm.register("name")} placeholder="John Doe" />
                    {ownerForm.formState.errors.name && (
                      <p className="text-sm text-destructive">{ownerForm.formState.errors.name.message}</p>
                    )}
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...ownerForm.register("email")}
                      placeholder="john@example.com"
                      disabled={!!initialData?.email}
                    />
                    {ownerForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{ownerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" {...ownerForm.register("phone")} placeholder="+91 98765 43210" />
                    {ownerForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{ownerForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                     <Label>Aadhar/PAN Card</Label>
                     <div className="border-2 border-dashed border-input hover:border-primary/50 rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload or drag & drop</span>
                        <input type="file" className="hidden" />
                     </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Input id="address" {...ownerForm.register("address")} placeholder="123 Main St, City, State" />
                  {ownerForm.formState.errors.address && (
                      <p className="text-sm text-destructive">{ownerForm.formState.errors.address.message}</p>
                    )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: PROPERTY DETAILS */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="propertyTitle">Property Title/Name</Label>
                  <Input id="propertyTitle" {...propertyForm.register("title")} placeholder="e.g. Sunnyvale Villa" />
                   {propertyForm.formState.errors.title && (
                      <p className="text-sm text-destructive">{propertyForm.formState.errors.title.message}</p>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Controller
                        control={propertyForm.control}
                        name="type"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Commercial">Commercial</SelectItem>
                                    <SelectItem value="Land">Land</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {propertyForm.formState.errors.type && (
                      <p className="text-sm text-destructive">{propertyForm.formState.errors.type.message}</p>
                    )}
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...propertyForm.register("location")} placeholder="City, Area" />
                     {propertyForm.formState.errors.location && (
                      <p className="text-sm text-destructive">{propertyForm.formState.errors.location.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                   <div className="space-y-2">
                    <Label htmlFor="builtUpArea">Built-up Area (sq ft)</Label>
                    <Input id="builtUpArea" type="number" {...propertyForm.register("builtUpArea")} placeholder="2500" />
                     {propertyForm.formState.errors.builtUpArea && (
                      <p className="text-sm text-destructive">{propertyForm.formState.errors.builtUpArea.message}</p>
                    )}
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="carpetArea">Carpet Area (sq ft)</Label>
                    <Input id="carpetArea" type="number" {...propertyForm.register("carpetArea")} placeholder="2000" />
                     {propertyForm.formState.errors.carpetArea && (
                      <p className="text-sm text-destructive">{propertyForm.formState.errors.carpetArea.message}</p>
                    )}
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="expectedValuation">Exp. Valuation (₹)</Label>
                    <Input id="expectedValuation" type="number" {...propertyForm.register("expectedValuation")} placeholder="50000000" />
                     {propertyForm.formState.errors.expectedValuation && (
                      <p className="text-sm text-destructive">{propertyForm.formState.errors.expectedValuation.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DOCUMENTS & SUBMIT */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                
                <div className="bg-secondary/20 p-4 rounded-lg border text-sm text-muted-foreground mb-4">
                  <p><strong>Note:</strong> Uploading clear documents helps speed up the verification process. Your data is encrypted and secure.</p>
                </div>

                {[
                  { label: "Proof of Ownership", sub: "Sale Deed / Title Deed", required: true },
                  { label: "Property Tax Receipts", sub: "Latest paid receipt", required: true },
                  { label: "Property Photos", sub: "Interior & Exterior (Max 5)", required: true },
                  { label: "Video Walkthrough", sub: "Optional, but recommended", required: false },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-secondary/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.label} {doc.required && <span className="text-destructive">*</span>}</p>
                        <p className="text-xs text-muted-foreground">{doc.sub}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <UploadCloud className="h-4 w-4" /> Upload
                    </Button>
                  </div>
                ))}
                
                {/* Summary Preview */}
                 <div className="mt-8 p-6 bg-secondary/10 rounded-xl border-dashed border-2">
                    <h3 className="font-semibold mb-4">Review Details</h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block">Owner:</span>
                            <span className="font-medium">{ownerForm.getValues("name")}</span>
                        </div>
                         <div>
                            <span className="text-muted-foreground block">Property:</span>
                            <span className="font-medium">{propertyForm.getValues("title")}</span>
                        </div>
                         <div>
                            <span className="text-muted-foreground block">Valuation:</span>
                            <span className="font-medium">₹ {propertyForm.getValues("expectedValuation")}</span>
                        </div>
                         <div>
                            <span className="text-muted-foreground block">Location:</span>
                            <span className="font-medium">{propertyForm.getValues("location")}</span>
                        </div>
                    </div>
                 </div>

              </motion.div>
            )}

          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
          >
            Back
          </Button>
          
          {currentStep < 3 ? (
             <Button onClick={handleNext}>Next Step</Button>
          ) : (
             <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[140px]">
               {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
               {isSubmitting ? "Submitting..." : "Submit for Review"}
             </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingForm;