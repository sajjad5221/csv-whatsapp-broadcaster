// src/utils/csvParser.js
export const parseCSV = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const csvText = event.target.result;
          const lines = csvText.split(/\r\n|\n/);
          
          // Extract headers
          const headers = lines[0].split(',').map(header => header.trim());
          
          // Find name and phone columns
          const nameIndex = headers.findIndex(h => 
            h.toLowerCase().includes('name') || h.toLowerCase() === 'contact');
          const phoneIndex = headers.findIndex(h => 
            h.toLowerCase().includes('phone') || h.toLowerCase().includes('mobile') || 
            h.toLowerCase().includes('tel'));
            
          if (nameIndex === -1 || phoneIndex === -1) {
            reject(new Error('CSV must contain name and phone columns'));
            return;
          }
          
          // Parse contacts
          const contacts = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(value => value.trim());
            
            // Ensure phone numbers are formatted correctly
            let phoneNumber = values[phoneIndex].replace(/[^\d+]/g, '');
            
            // Add + prefix if not present
            if (!phoneNumber.startsWith('+')) {
              phoneNumber = `+${phoneNumber}`;
            }
            
            contacts.push({
              id: i,
              name: values[nameIndex],
              phone: phoneNumber
            });
          }
          
          resolve(contacts);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  };