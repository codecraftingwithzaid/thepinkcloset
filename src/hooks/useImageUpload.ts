import { useState, useCallback } from 'react';

interface UseImageUploadOptions {
  folder: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onSuccess?: (urls: string[], paths: string[]) => void;
  onError?: (error: string) => void;
}

export function useImageUpload({
  folder,
  multiple = false,
  maxFiles = 10,
  maxSize = 5,
  onSuccess,
  onError,
}: UseImageUploadOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      setIsLoading(true);
      setProgress(0);

      try {
        const fileArray = Array.from(files);

        if (!multiple && fileArray.length > 1) {
          throw new Error('Only one file allowed');
        }

        if (fileArray.length > maxFiles) {
          throw new Error(`Maximum ${maxFiles} files allowed`);
        }

        // Validate file sizes
        for (const file of fileArray) {
          if (file.size > maxSize * 1024 * 1024) {
            throw new Error(`${file.name} exceeds ${maxSize}MB limit`);
          }
        }

        const formData = new FormData();
        fileArray.forEach((file) => formData.append('files', file));
        formData.append('folder', folder);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 15, 90));
        }, 200);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        // Extract paths from URLs
        const paths = data.urls.map((url: string) => {
          const match = url.match(/\/storage\/v1\/object\/public\/uploads\/(.+)$/);
          return match ? match[1] : url;
        });

        setUploadedUrls(data.urls);
        setUploadedPaths(paths);

        onSuccess?.(data.urls, paths);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        onError?.(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        setProgress(0);
      }
    },
    [folder, multiple, maxFiles, maxSize, onSuccess, onError]
  );

  const deleteImage = useCallback(async (filePath: string) => {
    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        body: JSON.stringify({ filePath }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Delete failed');
      }

      // Remove from state
      setUploadedUrls((prev) => prev.filter((_, idx) => prev[idx] !== filePath));
      setUploadedPaths((prev) => prev.filter((p) => p !== filePath));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      onError?.(errorMessage);
      throw error;
    }
  }, [onError]);

  const reset = useCallback(() => {
    setUploadedUrls([]);
    setUploadedPaths([]);
    setProgress(0);
  }, []);

  return {
    upload,
    deleteImage,
    reset,
    isLoading,
    progress,
    urls: uploadedUrls,
    paths: uploadedPaths,
  };
}
