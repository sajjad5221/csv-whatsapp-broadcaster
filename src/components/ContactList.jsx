// src/components/ContactList.jsx
export default function ContactList({ contacts, selectedContacts, onSelectContact, onSelectAll }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Found {contacts.length} contacts</h3>
          <button 
            onClick={onSelectAll}
            className="text-blue-600 hover:text-blue-800"
          >
            {selectedContacts.length === contacts.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-16 py-2 px-4 text-left"></th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-t">
                  <td className="py-2 px-4">
                    <input 
                      type="checkbox" 
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => onSelectContact(contact.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="py-2 px-4">{contact.name}</td>
                  <td className="py-2 px-4">{contact.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-right text-sm text-gray-600">
          {selectedContacts.length} contacts selected
        </div>
      </div>
    );
  }