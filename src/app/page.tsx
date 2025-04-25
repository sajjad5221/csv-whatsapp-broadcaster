// First, let's create the main page component in src/app/page.tsx

'use client';

import { useState } from 'react';
import { parseCSV } from '@/utils/csvParser'; // Ensure this points to csvParser.ts
import ContactList from '@/components/ContactList'; // Ensure this points to ContactList.tsx
import CSVUploader from '@/components/CSVUploader'; // Ensure this points to CSVUploader.tsx
import WhatsAppMessenger from '@/components/WhatsAppMessenger'; // Ensure this points to WhatsAppMessenger.tsx

interface Contact {
  id: number;
  name: string;
  phone: string;
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');
  const [csvError, setCsvError] = useState<string | null>(null); // State for CSV errors

  const handleCSVUpload = async (file: File) => {
    setCsvError(null); // Clear previous errors
    setSelectedContacts([]); // Reset selection on new upload
    try {
      const parsedContacts = await parseCSV(file);
      setContacts(parsedContacts);
      if (parsedContacts.length === 0) {
         setCsvError('No contacts found in the CSV file. Please check the content and format.');
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error parsing CSV file.';
      setCsvError(`Error parsing CSV: ${errorMessage}. Please check the file format and content.`);
      setContacts([]); // Clear contacts on error
    }
  };

  const handleContactSelect = (contactId: number) => {
    setSelectedContacts((prev) => {
      if (prev.includes(contactId)) {
        return prev.filter((id) => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      // Select only contacts that were successfully parsed
      setSelectedContacts(contacts.map((contact) => contact.id));
    }
  };

  // Filter contacts based on selection for the messenger
  const contactsToSend = contacts.filter(c => selectedContacts.includes(c.id));

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50"> {/* Added background color */}
      <div className="w-full max-w-4xl space-y-8"> {/* Adjusted max-width and added spacing */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">WhatsApp Bulk Messenger from CSV</h1>

        {/* Section 1: Upload */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Upload CSV File</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Upload a .csv file containing columns for contact <code className="bg-gray-100 px-1 rounded">name</code> and <code className="bg-gray-100 px-1 rounded">phone</code> number.
          </p>
          <CSVUploader onUpload={handleCSVUpload} />
          {csvError && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{csvError}</p>
          )}
        </section>

        {/* Section 2: Review Contacts (only show if contacts are loaded and no error) */}
        {contacts.length > 0 && !csvError && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">2. Select Contacts ({selectedContacts.length} / {contacts.length} selected)</h2>
             <ContactList
              contacts={contacts}
              selectedContacts={selectedContacts}
              onSelectContact={handleContactSelect}
              onSelectAll={handleSelectAll}
            />
          </section>
        )}

        {/* Section 3: Send Message (only show if contacts are loaded and no error) */}
        {contacts.length > 0 && !csvError && (
           <section className="bg-white p-6 rounded-lg shadow-md">
             <h2 className="text-xl font-semibold mb-4 text-gray-700">3. Compose & Send WhatsApp Message</h2>
             <WhatsAppMessenger
              contacts={contactsToSend} // Pass only selected contacts
              message={message}
              onMessageChange={setMessage}
            />
          </section>
        )}
      </div>
    </main>
  );
}