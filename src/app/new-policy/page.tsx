"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { FileDropzone } from "@/components/ui/file-dropzone";

const defaultValues = {
  company: "",
  contact: "",
  type: "",
  carrier: "",
  effective: undefined,
  expiration: undefined,
  premium: "",
  limit: "",
  deductible: "",
  notes: "",
  coverages: [
    {
      type: "",
      limit: "",
      deductible: "",
      sublimits: "",
      terms: "",
    },
  ],
};

export default function NewPolicyPage() {
  const [tab, setTab] = useState("quick");
  const [quickUploadFile, setQuickUploadFile] = useState<File | null>(null);
  const [manualUploadFile, setManualUploadFile] = useState<File | null>(null);
  const form = useForm({ defaultValues });

  const handleQuickFileSelect = (file: File) => setQuickUploadFile(file);
  const handleManualFileSelect = (file: File) => setManualUploadFile(file);

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">New Policy</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create a new policy to be processed by Ultron.
        </p>
      </div>
      <div className="px-4 sm:px-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="quick">Quick Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="quick">
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-lg font-semibold text-center">
                  Upload Policy Document
                </h2>
                <p className="text-gray-500 text-center text-sm mb-6">
                  Upload your policy document and let Ultron automatically
                  extract the information. Supported formats: PDF, DOC, DOCX
                </p>
                <div className="w-full">
                  <FileDropzone
                    onFileSelect={handleQuickFileSelect}
                    selectedFile={quickUploadFile}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="manual">
            <Card className="p-8">
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit((data) =>
                  alert(JSON.stringify(data, null, 2)),
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="company"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Company Name *</Label>
                        <Input required {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="contact"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Primary Contact *</Label>
                        <Input required {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Policy Type *</Label>
                        <Input required {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="carrier"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Insurance Carrier *</Label>
                        <Input required {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="effective"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Effective Date *</Label>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                          placeholder="Select effective date"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="expiration"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Expiration Date *</Label>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                          placeholder="Select expiration date"
                        />
                      </div>
                    )}
                  />
                  <Controller
                    name="premium"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Premium Amount *</Label>
                        <Input required {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="limit"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Coverage Limit *</Label>
                        <Input required {...field} />
                      </div>
                    )}
                  />
                  <Controller
                    name="deductible"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label className="mb-1">Deductible</Label>
                        <Input {...field} />
                      </div>
                    )}
                  />
                </div>
                <Controller
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Additional Notes</Label>
                      <Textarea rows={3} {...field} />
                    </div>
                  )}
                />
                <div>
                  <div className="font-semibold text-lg mb-6">Coverages</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="coverages.0.type"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <Label className="mb-1">Coverage Type *</Label>
                          <Input required {...field} />
                        </div>
                      )}
                    />
                    <Controller
                      name="coverages.0.limit"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <Label className="mb-1">Limit *</Label>
                          <Input required {...field} />
                        </div>
                      )}
                    />
                    <Controller
                      name="coverages.0.deductible"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <Label className="mb-1">Deductible *</Label>
                          <Input required {...field} />
                        </div>
                      )}
                    />
                    <Controller
                      name="coverages.0.sublimits"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <Label className="mb-1">Sub-limits</Label>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <Controller
                      name="coverages.0.terms"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <Label className="mb-1">Additional Terms</Label>
                          <Input {...field} />
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button type="button" variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4 mr-1" /> Add Coverage
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-4 text-lg">Documents</div>
                  <FileDropzone
                    onFileSelect={handleManualFileSelect}
                    selectedFile={manualUploadFile}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="mt-4">
                    Submit to Ultron
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
