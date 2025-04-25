import { useState, useRef, DragEvent, ChangeEvent, FC } from 'react';

interface CSVUploaderProps {
  onUpload: (file: File) => void;
}

const CSVUploader: FC<CSVUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/csv') {
      processFile(files[0]);
    } else {
      alert('Please upload a valid CSV file (.csv)');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       if (e.target.files[0].type === 'text/csv') {
         processFile(e.target.files[0]);
       } else {
         alert('Please select a valid CSV file (.csv)');
         setFileName(''); // Reset filename if invalid file selected
         if(fileInputRef.current) {
           fileInputRef.current.value = ''; // Reset input
         }
       }
    }
  };

  const processFile = (file: File) => {
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
      role="button"
      tabIndex={0}
      aria-label="CSV file uploader"
    >
      <input
        type="file"
        className="hidden"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {fileName ? (
        <div>
          <p className="font-medium text-green-600">File uploaded: {fileName}</p>
          <p className="text-sm text-gray-500 mt-2">Click or drag to upload a different file</p>
        </div>
      ) : (
        <div>
          <p className="font-medium">Drop your CSV file here, or click to browse</p>
          <p className="text-sm text-gray-500 mt-2">Only .csv files are supported</p>
        </div>
      )}
    </div>
  );
}

export default CSVUploader;