import React, { useState } from 'react';
import { Card } from '../common/Card';
import { CheckCircleIcon } from 'lucide-react';
export const NewContact: React.FC = () => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    email: '',
    phone: '',
    notes: '',
    contactType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to Ultron
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormState({
          firstName: '',
          lastName: '',
          company: '',
          jobTitle: '',
          email: '',
          phone: '',
          notes: '',
          contactType: ''
        });
      }, 3000);
    }, 1500);
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">New Contact</h1>
        <p className="text-gray-600">
          Add a new contact to be synced across systems by Ultron.
        </p>
      </div>
      <Card title="Contact Information">
        {isSuccess ? <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-600 mb-2">
              Contact Added Successfully
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              The contact has been sent to Ultron for processing and will be
              synced across all systems.
            </p>
          </div> : <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input type="text" id="firstName" name="firstName" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.firstName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input type="text" id="lastName" name="lastName" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.lastName} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input type="text" id="company" name="company" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.company} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input type="text" id="jobTitle" name="jobTitle" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.jobTitle} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input type="email" id="email" name="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.email} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input type="tel" id="phone" name="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.phone} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="contactType" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Type *
                </label>
                <select id="contactType" name="contactType" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.contactType} onChange={handleChange}>
                  <option value="">Select Contact Type</option>
                  <option value="Primary">Primary Contact</option>
                  <option value="Billing">Billing Contact</option>
                  <option value="Technical">Technical Contact</option>
                  <option value="Legal">Legal Contact</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea id="notes" name="notes" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={formState.notes} onChange={handleChange}></textarea>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className={`px-6 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isSubmitting ? 'Submitting...' : 'Submit to Ultron'}
              </button>
            </div>
          </form>}
      </Card>
    </div>;
};