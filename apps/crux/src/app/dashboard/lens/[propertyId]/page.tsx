"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LensChatContainer } from "@/components/dashboard/lens/LensChatContainer";
import { useApiFetch } from "@/lib/api";

export default function LensChatPage() {
  const params = useParams();
  const propertyId = params.propertyId as string;
  const apiFetch = useApiFetch();

  const [propertyName, setPropertyName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!propertyId) return;
    apiFetch<{ success: boolean; data?: { address_raw: string; address_normalized?: string | null } }>(
      `/crux/property/${propertyId}`
    )
      .then((res) => {
        if (res.success && res.data) {
          setPropertyName(res.data.address_normalized || res.data.address_raw);
        }
      })
      .catch(() => {
        // Non-fatal — header will show "Property" as fallback
      });
  }, [propertyId]);

  return (
    <DashboardShell variant="minimal">
      <LensChatContainer propertyId={propertyId} propertyName={propertyName} />
    </DashboardShell>
  );
}
