"use client";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUp, Trash, Upload, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadAvatarProps {
  size?: number;
  defaultImage?: string;
  onImageChange?: (imageString: string | null) => void;
  className?: string;
  disabled?: boolean;
}

export default function ImageUploadAvatar({
  size = 100,
  defaultImage,
  onImageChange,
  className,
  disabled = false,
}: ImageUploadAvatarProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultImage || null
  );
  const [imageString, setImageString] = useState<string | null>(
    defaultImage || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImagePreview(defaultImage as string);
  }, [defaultImage]);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setImageString(result);
        onImageChange?.(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("Error reading file.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image.");
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (disabled) return;
    setImagePreview(null);
    setImageString(null);
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getImageString = () => {
    return imageString;
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative group">
        <Avatar
          className="cursor-pointer transition-opacity hover:opacity-80"
          style={{ width: size, height: size }}
          onClick={handleUploadClick}
        >
          <AvatarImage src={imagePreview || undefined} alt="Upload preview" />
          <AvatarFallback className="bg-muted">
            {/* <User className="w-1/2 h-1/2 text-muted-foreground" /> */}
            <ImageUp className="w-1/2 h-1/2 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        {imagePreview && !disabled && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        )}

        {!imagePreview && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleUploadClick}
          >
            <Upload className="w-6 h-6 text-foreground" />
          </div>
        )}
      </div>

      {/* <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUploadClick}
          disabled={disabled || isUploading}
          className=" border-gray-300 hover:bg-gray-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading
            ? "Uploading..."
            : imagePreview
            ? "Change Image"
            : "Upload Image"}
        </Button>

        {imagePreview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveImage}
            disabled={disabled}
            className="text-red-600 hover:text-foregroundround hover:bg-red-50"
          >
            <Trash className="w-4 h-4 mr-2" />
            Remove Image
          </Button>
        )}
      </div> */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}

// Export the getImageString function for external access
export { ImageUploadAvatar };
