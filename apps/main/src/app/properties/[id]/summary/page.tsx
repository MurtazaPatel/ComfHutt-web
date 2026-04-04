import React from 'react';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/lib/mock-data';
import PropertySummary from '@/components/PropertySummary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertySummaryPage({ params }: PageProps) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main>
        <PropertySummary property={property} />
      </main>
      <Footer />
    </div>
  );
}