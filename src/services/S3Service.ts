/**
 * Service for handling S3 operations using presigned URLs
 * This is specifically separated from regular API calls to avoid 
 * any interference between them and to properly manage upload lifecycles
 */

// Track active upload XHR requests to properly abort if needed
const activeUploads = new Map<string, XMLHttpRequest>();

/**
 * Upload a file to S3 using a presigned URL
 * Returns a promise that resolves when the upload is complete
 */
export const uploadFileToS3 = (
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void,
  uploadId?: string,
  retryCount: number = 0
): Promise<boolean> => {
  // Generate a unique ID for this upload if not provided
  const id = uploadId || Math.random().toString(36).substring(2, 9);

  // Cancel any existing upload with this ID
  if (activeUploads.has(id)) {
    const xhr = activeUploads.get(id);
    if (xhr) {
      xhr.abort();
      activeUploads.delete(id);
    }
  }

  console.log(`Starting S3 upload for ${file.name} (${file.size} bytes) to ${presignedUrl.split('?')[0]}`);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Store this upload to allow cancellation
    activeUploads.set(id, xhr);

    // Set up event listeners
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      activeUploads.delete(id);
      
      console.log(`S3 upload response: Status ${xhr.status}, Response headers:`, xhr.getAllResponseHeaders());
      
      if (xhr.status >= 200 && xhr.status < 300) {
        // Upload successful
        console.log(`Upload successful for ${file.name}`);
        resolve(true);
      } else {
        // Upload failed with error status
        console.error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`);
        
        // Log all response headers for debugging CORS issues
        console.error(`Response headers: ${xhr.getAllResponseHeaders()}`);
        
        // Handle specific error cases
        if (xhr.status === 0) {
          console.error("CORS error detected - no response from server");
        }
        
        // Retry logic for potentially transient errors
        if (retryCount < 2 && (xhr.status === 0 || xhr.status === 503 || xhr.status === 429)) {
          console.log(`Retrying upload (attempt ${retryCount + 1})...`);
          setTimeout(() => {
            uploadFileToS3(file, presignedUrl, onProgress, id, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }
        
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = (event) => {
      activeUploads.delete(id);
      console.error(`Network error during upload of ${file.name}`, event);
      
      // Detailed error logging for debugging
      console.error('XHR error details:', {
        readyState: xhr.readyState,
        status: xhr.status,
        statusText: xhr.statusText,
        responseHeaders: xhr.getAllResponseHeaders()
      });
      
      // Check for common CORS error patterns
      if (xhr.status === 0) {
        console.error("Possible CORS error - client prevented the request");
        
        // Retry for potential CORS errors
        if (retryCount < 2) {
          console.log(`Retrying upload after CORS error (attempt ${retryCount + 1})...`);
          setTimeout(() => {
            uploadFileToS3(file, presignedUrl, onProgress, id, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }
      }
      
      reject(new Error('Network error during upload'));
    };

    xhr.onabort = () => {
      activeUploads.delete(id);
      console.log(`Upload aborted for ${file.name}`);
      reject(new Error('Upload aborted'));
    };

    // Open connection - do this after setting handlers
    xhr.open('PUT', presignedUrl);

    // IMPORTANT: DO NOT SET ANY HEADERS for S3 presigned URLs
    // The S3 signature includes expected headers, and adding any headers 
    // (even Content-Type) will cause a SignatureDoesNotMatch error
    
    // Disable CORS for presigned URLs - presigned URLs handle auth through the URL
    xhr.withCredentials = false;
    
    // Critical: Send the file
    try {
      xhr.send(file);
      console.log(`XHR send initiated for ${file.name}`);
    } catch (error) {
      console.error(`Error sending file: ${error}`);
      activeUploads.delete(id);
      reject(error);
    }
  });
};

/**
 * Cancel an active upload
 * @param uploadId The ID of the upload to cancel
 * @returns True if an upload was found and cancelled, false otherwise
 */
export const cancelUpload = (uploadId: string): boolean => {
  const xhr = activeUploads.get(uploadId);
  
  if (xhr) {
    xhr.abort();
    activeUploads.delete(uploadId);
    return true;
  }
  
  return false;
};

/**
 * Cancel all active uploads
 * @returns The number of uploads that were cancelled
 */
export const cancelAllUploads = (): number => {
  let count = 0;
  
  activeUploads.forEach((xhr, id) => {
    xhr.abort();
    activeUploads.delete(id);
    count++;
  });
  
  return count;
};

/**
 * Get the number of active uploads
 * @returns The number of currently active uploads
 */
export const getActiveUploadCount = (): number => {
  return activeUploads.size;
}; 