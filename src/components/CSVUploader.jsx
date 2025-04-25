import { useState, useRef } from 'react';

export default function CSVUploader({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/csv') {
      processFile(files[0]);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setFileName(file.name);
    onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        className="hidden" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      {fileName ? (
        <div>
          <p className="font-medium text-green-600">File uploaded: {fileName}</p>
          <p className="text-sm text-gray-500 mt-2">Click or drag to upload a different file</p>
        </div>
      ) : (
        <div>
          <p className="font-medium">Drop your CSV file here, or click to browse</p>
          <p className="text-sm text-gray-500 mt-2">Only CSV files are supported</p>
        </div>
      )}
    </div>
  );
}
