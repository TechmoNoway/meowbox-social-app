import { Loader2 } from "lucide-react";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Loader = ({ size = "md", className = "" }: LoaderProps) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  }[size];

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="relative flex items-center justify-center">
        <Loader2 className={`${sizeClass} animate-spin text-primary-500`} />
      </div>
    </div>
  );
};

export default Loader;
