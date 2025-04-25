interface Contact {
  id: number;
  name: string;
  phone: string;
}

interface ContactListProps {
  contacts: Contact[];
  selectedContacts: number[];
  onSelectContact: (id: number) => void;
  onSelectAll: () => void;
}

export default function ContactList({ contacts, selectedContacts, onSelectContact, onSelectAll }: ContactListProps) {
  const isAllSelected = contacts.length > 0 && selectedContacts.length === contacts.length;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                />
                <label htmlFor="checkbox-all" className="sr-only">Select all contacts</label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone Number
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50">
              <td className="p-4 w-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-${contact.id}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => onSelectContact(contact.id)}
                  />
                  <label htmlFor={`checkbox-${contact.id}`} className="sr-only">Select contact {contact.name}</label>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {contact.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {contact.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {contacts.length === 0 && (
        <p className="text-center text-gray-500 py-4">No contacts found. Upload a CSV file first.</p>
      )}
    </div>
  );
}