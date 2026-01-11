"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormSchema, ContactFormValues } from "@/lib/validations/contact";
import { Loader2, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");
      reset();

      // Emit analytics event if window.dataLayer exists
      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({ event: "contact_form_submit" });
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactPersons = [
    {
      name: "Murtaza Patel",
      phone: "+91 7016983248",
      initials: "MP",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "Yagnesh Akbari",
      phone: "+91 9913017800",
      initials: "YA",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <section className="bg-white py-20 border-t border-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Form */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Get in Touch</h2>
            <p className="text-gray-500 mb-8 text-sm">Have questions about fractional ownership? We're here to help.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  disabled={isSubmitting}
                  className={`
                    w-full px-4 py-3 rounded-lg bg-gray-50 border transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none
                    ${errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"}
                  `}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  disabled={isSubmitting}
                  className={`
                    w-full px-4 py-3 rounded-lg bg-gray-50 border transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none
                    ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"}
                  `}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  disabled={isSubmitting}
                  className={`
                    w-full px-4 py-3 rounded-lg bg-gray-50 border transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none
                    ${errors.message ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"}
                  `}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button & Status */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg flex items-center gap-2 border border-emerald-100"
                    >
                      <CheckCircle className="w-4 h-4" /> Message sent successfully! We'll get back to you soon.
                    </motion.div>
                  )}
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-100"
                    >
                      <AlertCircle className="w-4 h-4" /> {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* Right Column: Contact Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
               <h3 className="text-lg font-bold text-gray-900 mb-1">Direct Contact</h3>
               <p className="text-gray-500 text-sm">Reach out to our founders directly.</p>
            </div>

            <div className="space-y-6">
              {contactPersons.map((person, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${person.color}`}>
                    {person.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm">{person.name}</h4>
                    <div className="mt-1.5 space-y-1">
                      <a 
                        href={`tel:${person.phone.replace(/\s/g, '')}`} 
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {person.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100">
               <p className="text-xs text-gray-400 font-medium">
                 Feel free to reach out to us at <a href="mailto:support@comfhutt.com" className="text-emerald-600 hover:underline">support@comfhutt.com</a> for more info and queries.
               </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}