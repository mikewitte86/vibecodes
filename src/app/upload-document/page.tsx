"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/ui/file-dropzone";

const defaultValues = {
  company: "No companies found",
  policy: "Select a company first",
  documentType: "Select company and policy first",
  files: null,
};

export default function UploadDocumentPage() {
  const form = useForm({ defaultValues });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">Upload Document</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload documents to be processed and managed by Ultron.
        </p>
      </div>
      <div className="px-4 sm:px-6">
        <Card>
          <CardHeader className="flex items-center border-b bg-gray-50 rounded-t-xl font-semibold text-lg pt-4 px-6">
            Document Upload
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) =>
                alert(JSON.stringify(data, null, 2)),
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Controller
                  name="company"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Company *</Label>
                      <Input disabled {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="policy"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Policy *</Label>
                      <Input disabled {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="documentType"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Document Type *</Label>
                      <Input disabled {...field} />
                    </div>
                  )}
                />
              </div>
              <div>
                <Label className="mb-3">Upload Documents *</Label>
                <Controller
                  name="files"
                  control={form.control}
                  render={({ field }) => (
                    <FileDropzone
                      onFileSelect={(file) => {
                        setSelectedFile(file);
                        field.onChange(file);
                      }}
                      selectedFile={selectedFile}
                      acceptedTypes=".pdf,.doc,.docx"
                      label="Drag & drop files here, or click to select files"
                      description="Supported files: PDF, DOC, DOCX"
                    />
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="mt-4" disabled>
                  Upload Documents
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
