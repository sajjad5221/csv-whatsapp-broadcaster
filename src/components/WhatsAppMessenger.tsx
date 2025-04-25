import { useState, FC } from 'react';

interface Contact {
  id: number;
  name: string;
  phone: string;
}

interface WhatsAppMessengerProps {
  contacts: Contact[];
  message: string;
  onMessageChange: (message: string) => void;
}

const WhatsAppMessenger: FC<WhatsAppMessengerProps> = ({ contacts, message, onMessageChange }) => {
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (contacts.length === 0) {
      alert('Please select at least one contact');
      return;
    }

    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setIsSending(true);

    // Function to open WhatsApp link
    const openWhatsApp = (contact: Contact) => {
      // Replace placeholder, encode message, clean phone number
      const personalizedMessage = message.replace(/\[NAME\]/gi, contact.name);
      const encodedMessage = encodeURIComponent(personalizedMessage);
      const cleanPhoneNumber = contact.phone.replace(/\D/g, ''); // Remove all non-digits
      const url = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
      window.open(url, '_blank');
    };

    if (contacts.length === 1) {
      // Single contact: open directly
      openWhatsApp(contacts[0]);
      setIsSending(false); // Reset button state immediately for single send
    } else {
      // Multiple contacts: open one by one with delay
      alert(`You will now be directed to send messages to ${contacts.length} contacts one by one. WhatsApp Web/Desktop will open for each contact.`);

      contacts.forEach((contact, index) => {
        setTimeout(() => {
          openWhatsApp(contact);

          // Reset button state after the last tab is opened
          if (index === contacts.length - 1) {
            setIsSending(false);
          }
        }, index * 1500); // Increased delay to reduce potential browser blocking
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="message-textarea" className="block text-gray-700 mb-2">
          Message Template
          <span className="text-sm text-gray-500 ml-2">
            (use [NAME] to personalize with contact's name)
          </span>
        </label>
        <textarea
          id="message-textarea"
          className="w-full border rounded-lg p-3 min-h-[120px] shadow-sm focus:ring-blue-500 focus:border-blue-500" // Added min-height and focus styles
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Example: Hello [NAME], just checking in!"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''} selected for messaging.
        </div>

        <button
          onClick={handleSend}
          disabled={isSending || contacts.length === 0 || !message.trim()}
          className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
            isSending || contacts.length === 0 || !message.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' // Added focus styles
          }`}
        >
          {isSending ? 'Opening WhatsApp...' : `Send to ${contacts.length} Contact${contacts.length !== 1 ? 's' : ''}`}
        </button>
      </div>

      {contacts.length > 1 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> For multiple contacts, WhatsApp will open for each person.
            You may need to manually click 'Send' in each WhatsApp chat window/tab due to platform limitations.
          </p>
        </div>
      )}
    </div>
  );
}

export default WhatsAppMessenger;