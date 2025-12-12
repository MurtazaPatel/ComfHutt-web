"use client";

import React from "react";
import { ShieldCheck, Banknote, Scale, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reassurances = [
  {
    icon: Banknote,
    title: "Zero Upfront Fees",
    description: "We only earn when you do. No hidden listing charges.",
  },
  {
    icon: Scale,
    title: "Guaranteed Legal Compliance",
    description: "Our legal experts handle all SPV structuring and regulations.",
  },
  {
    icon: ShieldCheck,
    title: "Ownership Rights Protected",
    description: "You retain control while unlocking liquidity.",
  },
  {
    icon: Users,
    title: "Dedicated Success Team",
    description: "24/7 support to manage your listing and investors.",
  },
  {
    icon: Award,
    title: "Faster Liquidity",
    description: "Access capital quickly through our network of fractional investors.",
  },
];

const TrustSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Why Property Owners Trust ComfHutt
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Built on transparency, security, and mutual growth.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reassurances.map((item, index) => (
            <Card key={index} className="bg-card hover:bg-secondary/20 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;