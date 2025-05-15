"use client";

import { useForm, Controller } from "react-hook-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const defaultValues = {
  firstName: "",
  lastName: "",
  company: "",
  jobTitle: "",
  email: "",
  phone: "",
  contactType: "",
  notes: "",
};

export default function NewContactPage() {
  const form = useForm({ defaultValues });

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4">
        <h1 className="text-2xl font-bold">New Contact</h1>
        <p className="text-gray-500 text-sm mt-1">
          Add a new contact to be synced across systems by Ultron.
        </p>
      </div>
      <div className="px-4 sm:px-6">
        <Card>
          <CardHeader className="flex items-center border-b bg-gray-50 rounded-t-xl font-semibold text-lg pt-4 px-6">
            Contact Information
          </CardHeader>
          <CardContent className="px-6 pt-6">
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) =>
                alert(JSON.stringify(data, null, 2)),
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">First Name *</Label>
                      <Input required {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Last Name *</Label>
                      <Input required {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="company"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Company *</Label>
                      <Input required {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="jobTitle"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Job Title</Label>
                      <Input {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Email Address *</Label>
                      <Input type="email" required {...field} />
                    </div>
                  )}
                />
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <Label className="mb-1">Phone Number</Label>
                      <Input type="tel" {...field} />
                    </div>
                  )}
                />
                <div className="md:col-span-2 flex flex-col gap-1">
                  <Label className="mb-1">Contact Type *</Label>
                  <Controller
                    name="contactType"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        required
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Contact Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">
                            Primary Contact
                          </SelectItem>
                          <SelectItem value="billing">
                            Billing Contact
                          </SelectItem>
                          <SelectItem value="technical">
                            Technical Contact
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1">
                  <Label className="mb-1">Notes</Label>
                  <Controller
                    name="notes"
                    control={form.control}
                    render={({ field }) => <Textarea rows={3} {...field} />}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="mt-4">
                  Submit to Ultron
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
