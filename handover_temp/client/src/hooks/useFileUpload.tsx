import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseFileUploadOptions {
  maxSizeMB?: number;
  accept?: string;
}

interface UseFileUploadReturn {
  uploadFile: (options: {
    accept?: string;
    onFileSelected: (file: File) => void;
  }) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { maxSizeMB = 10, accept = "*/*" } = options;
  const { toast } = useToast();
  
  const uploadFile = useCallback(
    ({ accept = "*/*", onFileSelected }: { accept?: string; onFileSelected: (file: File) => void }) => {
      // Create a file input element
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = accept;
      fileInput.style.display = "none";
      document.body.appendChild(fileInput);
      
      const handleFileSelection = () => {
        const files = fileInput.files;
        if (!files || files.length === 0) {
          document.body.removeChild(fileInput);
          return;
        }
        
        const file = files[0];
        
        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          toast({
            title: "File Too Large",
            description: `File size must be less than ${maxSizeMB}MB. Selected file is ${fileSizeMB.toFixed(2)}MB.`,
            variant: "destructive",
          });
          document.body.removeChild(fileInput);
          return;
        }
        
        // Call the callback with the file
        onFileSelected(file);
        
        // Clean up
        document.body.removeChild(fileInput);
      };
      
      fileInput.addEventListener("change", handleFileSelection);
      
      // Trigger the file selection dialog
      fileInput.click();
    },
    [maxSizeMB, toast]
  );
  
  return { uploadFile };
}
