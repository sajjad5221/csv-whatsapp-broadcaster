import { useState } from 'react';

export default function WhatsAppMessenger({ contacts, message, onMessageChange }) {
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
    
    // For single contact, open WhatsApp directly
    if (contacts.length === 1) {
      const contact = contacts[0];
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${contact.phone.replace(/\+/g, '')}?text=${encodedMessage}`, '_blank');
      return;
    }
    
    // For multiple contacts, handle one by one
    setIsSending(true);
    
    // Show instructions for multiple contacts
    alert(`You will now be directed to send messages to ${contacts.length} contacts one by one. WhatsApp Web will open in new tabs.`);
    
    // Open WhatsApp links with a delay to prevent popup blocking
    contacts.forEach((contact, index) => {
      setTimeout(() => {
        const encodedMessage = encodeURIComponent(message.replace('[NAME]', contact.name));
        window.open(`https://wa.me/${contact.phone.replace(/\+/g, '')}?text=${encodedMessage}`, '_blank');
        
        if (index === contacts.length - 1) {
          setIsSending(false);
        }
      }, index * 1000);
    });
  };
  
  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Message Template
          <span className="text-sm text-gray-500 ml-2">
            (use [NAME] to include contact's name)
          </span>
        </label>
        <textarea 
          className="w-full border rounded-lg p-3 min-h-32"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Hello [NAME], I wanted to reach out about..."
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {contacts.length} contacts will receive this message
        </div>
        
        <button 
          onClick={handleSend}
          disabled={isSending || contacts.length === 0 || !message.trim()}
          className={`px-6 py-2 rounded-lg ${
            isSending || contacts.length === 0 || !message.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isSending ? 'Opening WhatsApp...' : 'Send WhatsApp Messages'}
        </button>
      </div>
      
      {contacts.length > 1 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> For multiple contacts, WhatsApp Web will open in separate tabs.
            You'll need to manually click send in each tab due to WhatsApp limitations.
          </p>
        </div>
      )}
    </div>
  );
}