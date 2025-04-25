interface Contact {
  id: number;
  name: string;
  phone: string;
}

export const parseCSV = async (file: File): Promise<Contact[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file');
        }

        const csvText = event.target.result as string;
        const lines = csvText.split(/\r\n|\n/);

        // Remove empty lines at the end
        while (lines.length > 0 && !lines[lines.length - 1].trim()) {
          lines.pop();
        }

        if (lines.length < 2) {
           reject(new Error('CSV file must contain headers and at least one data row'));
           return;
        }

        // Extract headers
        const headers = lines[0].split(',').map(header => header.trim().toLowerCase());

        // Find name and phone columns (case-insensitive)
        const nameIndex = headers.findIndex(h => h.includes('name') || h === 'contact');
        const phoneIndex = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('tel'));

        if (nameIndex === -1 || phoneIndex === -1) {
          reject(new Error('CSV must contain columns identifiable as "name" and "phone" (or similar)'));
          return;
        }

        // Parse contacts
        const contacts: Contact[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines

          // Basic CSV splitting (doesn't handle commas within quotes)
          const values = lines[i].split(',').map(value => value.trim());

          if (values.length <= Math.max(nameIndex, phoneIndex)) {
             console.warn(`Skipping row ${i + 1}: Not enough columns.`);
             continue;
          }

          const name = values[nameIndex];
          let phoneNumber = values[phoneIndex].replace(/[^\d+]/g, ''); // Remove non-digit characters except '+'

          // Add + prefix if missing and it looks like a standard number
          if (!phoneNumber.startsWith('+') && /^\d+$/.test(phoneNumber)) {
            // Basic assumption: add '+' if it's just digits. Might need refinement for specific country codes.
            phoneNumber = `+${phoneNumber}`;
          }

          if (name && phoneNumber) {
             contacts.push({
               id: i, // Use line number (1-based index) as ID
               name: name,
               phone: phoneNumber
             });
          } else {
             console.warn(`Skipping row ${i + 1}: Missing name or phone number after cleaning.`);
          }
        }

        resolve(contacts);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
};