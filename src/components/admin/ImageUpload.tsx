'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
    onUpload: (urls: string[], paths: string[]) => void;
    folder: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number; // in MB
}

export function ImageUpload({ onUpload, folder, multiple = false, maxFiles = 10, maxSize = 5 }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<
        Array<{ url: string; path: string; name: string; preview: string }>
    >([]);

    const handleFiles = useCallback(
        async (files: FileList) => {
            const fileArray = Array.from(files);

            if (!multiple && fileArray.length > 1) {
                toast.error('Only one file allowed');
                return;
            }

            if (fileArray.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} files allowed`);
                return;
            }

            // Check file sizes
            for (const file of fileArray) {
                if (file.size > maxSize * 1024 * 1024) {
                    toast.error(`${file.name} exceeds ${maxSize}MB limit`);
                    return;
                }
            }

            setIsUploading(true);
            setUploadProgress(0);

            try {
                const formData = new FormData();
                fileArray.forEach((file) => formData.append('files', file));
                formData.append('folder', folder);

                // Simulate progress
                const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => Math.min(prev + 10, 90));
                }, 200);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                clearInterval(progressInterval);

                const data = await response.json();

                if (!data.success) {
                    toast.error(data.error || 'Upload failed');
                    setIsUploading(false);
                    return;
                }

                setUploadProgress(100);

                // Extract paths from URLs
                const paths = data.urls.map((url: string) => {
                    const match = url.match(/\/storage\/v1\/object\/public\/uploads\/(.+)$/);
                    return match ? match[1] : url;
                });

                // Create previews
                const newFiles = fileArray.map((file, index) => ({
                    url: data.urls[index],
                    path: paths[index],
                    name: file.name,
                    preview: URL.createObjectURL(file),
                }));

                if (multiple) {
                    const allFiles = [...uploadedFiles, ...newFiles];
                    setUploadedFiles(allFiles);
                    onUpload(
                        allFiles.map((f) => f.url),
                        allFiles.map((f) => f.path)
                    );
                } else {
                    setUploadedFiles(newFiles);
                    onUpload([newFiles[0].url], [newFiles[0].path]);
                }

                toast.success(`${fileArray.length} file(s) uploaded successfully`);
            } catch (error) {
                console.error('Upload error:', error);
                toast.error('Upload failed');
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        },
        [folder, multiple, maxFiles, maxSize, onUpload, uploadedFiles]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        onUpload(
            newFiles.map((f) => f.url),
            newFiles.map((f) => f.path)
        );
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <label
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative block w-full rounded-lg border-2 border-dashed transition-colors cursor-pointer ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
            >
                <input
                    type="file"
                    multiple={multiple}
                    accept="image/*"
                    onChange={handleInputChange}
                    disabled={isUploading}
                    className="sr-only"
                />
                <div className="flex flex-col items-center justify-center px-6 py-10">
                    <Upload className={`h-10 w-10 mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium text-gray-900">Drag and drop images here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to select files</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Supported: JPG, PNG, WebP (Max {maxSize}MB per file)
                    </p>
                </div>

                {/* Upload Progress */}
                {isUploading && uploadProgress > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                        <div className="text-center">
                            <div className="mb-2 h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs font-medium text-gray-700">{uploadProgress}%</p>
                        </div>
                    </div>
                )}
            </label>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">{uploadedFiles.length} file(s) uploaded</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
