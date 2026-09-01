import { ImagePlus, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl?: string;
};

const FileUploader = ({ fieldChange, mediaUrl = "" }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      if (acceptedFiles[0]) {
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      }
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpg", ".jpeg", ".svg", ".webp"],
    },
  });

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile([]);
    setFileUrl("");
    fieldChange([]);
  };

  return (
    <div
      {...getRootProps()}
      className={`relative flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
        isDragActive
          ? "border-primary-500 bg-primary-500/10 shadow-glow"
          : "border-white/10 bg-dark-3/60 hover:border-primary-500/40 hover:bg-dark-3/90"
      }`}
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <div className="relative w-full group">
          <img
            src={fileUrl}
            alt="uploaded"
            className="w-full max-h-[420px] object-cover rounded-[22px]"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex-center gap-3">
            <Button
              type="button"
              size="sm"
              className="bg-dark-2/90 text-white hover:bg-dark-1 rounded-xl text-xs"
            >
              <ImagePlus className="w-4 h-4 mr-1.5" />
              Change Photo
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleClearImage}
              className="rounded-xl text-xs"
            >
              <X className="w-4 h-4 mr-1.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/15 border border-primary-500/30 flex-center text-primary-500 mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="font-bold text-sm sm:text-base text-light-1 mb-1">
            Drag & drop your cat photos here
          </h3>
          <p className="text-xs text-light-4 mb-4">
            Supports High-Res JPG, PNG, WEBP & GIF
          </p>

          <Button
            type="button"
            className="h-9 px-4 bg-dark-4 hover:bg-dark-5 text-light-2 border border-white/[0.08] text-xs font-semibold rounded-xl"
          >
            Browse files
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
