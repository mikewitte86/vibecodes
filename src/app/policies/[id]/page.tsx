"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { policyApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PolicyDetailPage() {
  const { id } = useParams();
  console.log('Policy ID from params:', id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["policy", id],
    queryFn: async () => {
      console.log('Fetching policy with ID:', id);
      const response = await policyApi.getPolicy(id as string, "lumen");
      console.log('Raw API response:', JSON.stringify(response, null, 2));
      return response;
    },
    retry: 1,
  });

  const policy = data?.body?.policy;
  console.log('Extracted policy:', policy);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Policy Not Found</h1>
        <p className="text-gray-500 mb-4">{error?.message || "Could not find the requested policy"}</p>
        <div className="text-sm text-gray-500 mb-4 max-w-lg overflow-auto">
          <h3 className="font-semibold mb-2">Raw API Response:</h3>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <Link href="/policies">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Policies
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <div className="flex items-center gap-4">
          <Link href="/policies">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Policy Details</h1>
            <p className="text-gray-500 text-sm mt-1">
              Policy Number: {policy.number}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Policy Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Number</label>
                  <p className="mt-1">{policy.number}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className="mt-1">{policy.status}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Carrier</label>
                  <p className="mt-1">{policy.carrier}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Premium</label>
                  <p className="mt-1">${policy.premium?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Effective Date</label>
                  <p className="mt-1">{new Date(policy.effective_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Expiration Date</label>
                  <p className="mt-1">{new Date(policy.expiration_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Lines of Business</h2>
              <div className="space-y-2">
                {policy.line_of_business?.map((lob) => (
                  <div key={lob.databaseId} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{lob.lineOfBusinessName}</p>
                    <p className="text-sm text-gray-500 mt-1">Class: {lob.lineOfBusinessClassName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Insured Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="mt-1">{policy.insured.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">ID</label>
                  <p className="mt-1">{policy.insured.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 