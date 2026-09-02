import { Check, ImagePlus, Sliders, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

export const INSTAGRAM_FILTERS = [
  { id: "normal", name: "Normal", class: "filter-normal" },
  { id: "clarendon", name: "Clarendon", class: "filter-clarendon" },
  { id: "gingham", name: "Gingham", class: "filter-gingham" },
  { id: "moon", name: "Moon", class: "filter-moon" },
  { id: "lark", name: "Lark", class: "filter-lark" },
  { id: "juno", name: "Juno", class: "filter-juno" },
  { id: "valencia", name: "Valencia", class: "filter-valencia" },
];

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl?: string;
  selectedFilter?: string;
  onSelectFilter?: (filterId: string) => void;
};

const FileUploader = ({
  fieldChange,
  mediaUrl = "",
  selectedFilter = "normal",
  onSelectFilter,
}: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [aspectRatio, setAspectRatio] = useState<"square" | "portrait" | "landscape">("square");

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

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "portrait":
        return "aspect-[4/5] max-h-[520px]";
      case "landscape":
        return "aspect-[16/9] max-h-[360px]";
      case "square":
      default:
        return "aspect-square max-h-[440px]";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden bg-dark-2 ${
          isDragActive
            ? "border-primary-500 bg-dark-3"
            : "border-dark-4 hover:border-dark-5"
        }`}
      >
        <input {...getInputProps()} className="cursor-pointer" />

        {fileUrl ? (
          <div className="relative w-full flex-center bg-black">
            <img
              src={fileUrl}
              alt="uploaded"
              className={`w-full object-cover filter-${selectedFilter} ${getAspectClass()}`}
            />
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleClearImage}
                className="h-8 px-2.5 rounded-lg text-xs font-semibold shadow-lg"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center">
            <div className="w-16 h-16 rounded-full bg-dark-3 flex-center text-light-1 mb-4">
              <UploadCloud className="w-8 h-8 stroke-[1.5px]" />
            </div>

            <h3 className="font-bold text-base text-light-1 mb-1">
              Drag photos and videos here
            </h3>
            <p className="text-xs text-light-4 mb-5">
              Supports High-Res JPG, PNG, WEBP & MP4
            </p>

            <Button
              type="button"
              className="h-9 px-4 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-lg"
            >
              Select from computer
            </Button>
          </div>
        )}
      </div>

      {/* Filter & Aspect Ratio Picker when image is loaded */}
      {fileUrl && (
        <div className="flex flex-col gap-3 p-4 bg-dark-2 rounded-2xl border border-dark-4">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-dark-4 text-xs">
            <span className="font-semibold text-light-3">Aspect Ratio</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAspectRatio("square")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  aspectRatio === "square"
                    ? "bg-dark-4 text-white"
                    : "text-light-4 hover:text-white"
                }`}
              >
                1:1 Square
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio("portrait")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  aspectRatio === "portrait"
                    ? "bg-dark-4 text-white"
                    : "text-light-4 hover:text-white"
                }`}
              >
                4:5 Portrait
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio("landscape")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  aspectRatio === "landscape"
                    ? "bg-dark-4 text-white"
                    : "text-light-4 hover:text-white"
                }`}
              >
                16:9 Wide
              </button>
            </div>
          </div>

          {/* Instagram Filters Reel */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-light-3 text-xs flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary-500" /> Photo Filters
            </span>

            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar py-1">
              {INSTAGRAM_FILTERS.map((f) => {
                const isSelected = selectedFilter === f.id;

                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onSelectFilter?.(f.id)}
                    className="flex flex-col items-center gap-1 shrink-0 group"
                  >
                    <div
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected
                          ? "border-primary-500 ring-2 ring-primary-500/30"
                          : "border-dark-4 group-hover:border-light-4"
                      }`}
                    >
                      <img
                        src={fileUrl}
                        alt={f.name}
                        className={`w-full h-full object-cover filter-${f.id}`}
                      />
                    </div>
                    <span
                      className={`text-[11px] ${
                        isSelected
                          ? "font-bold text-primary-500"
                          : "text-light-4 group-hover:text-white"
                      }`}
                    >
                      {f.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
