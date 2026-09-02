import { IMockStory } from "@/lib/mock/mockData";
import { ChevronLeft, ChevronRight, Heart, Pause, Play, Send, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "../ui/use-toast";

type StoryViewerProps = {
  stories: IMockStory[];
  initialStoryIndex?: number;
  onClose: () => void;
};

const StoryViewer = ({
  stories,
  initialStoryIndex = 0,
  onClose,
}: StoryViewerProps) => {
  const [currentStoryIdx, setCurrentStoryIdx] = useState(initialStoryIndex);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const activeStory = stories[currentStoryIdx];
  const activeItems = activeStory?.items || [];
  const currentItem = activeItems[currentItemIdx];

  const DURATION_MS = 4500;
  const STEP_MS = 50;

  // Handle Progress Timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextItem();
          return 0;
        }
        return prev + (STEP_MS / DURATION_MS) * 100;
      });
    }, STEP_MS);

    return () => clearInterval(interval);
  }, [currentStoryIdx, currentItemIdx, isPaused]);

  // Handle Keyboard Navigation & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNextItem();
      if (e.key === "ArrowLeft") handlePrevItem();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStoryIdx, currentItemIdx]);

  const handleNextItem = () => {
    if (currentItemIdx < activeItems.length - 1) {
      setCurrentItemIdx((prev) => prev + 1);
      setProgress(0);
    } else if (currentStoryIdx < stories.length - 1) {
      setCurrentStoryIdx((prev) => prev + 1);
      setCurrentItemIdx(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevItem = () => {
    if (currentItemIdx > 0) {
      setCurrentItemIdx((prev) => prev - 1);
      setProgress(0);
    } else if (currentStoryIdx > 0) {
      setCurrentStoryIdx((prev) => prev - 1);
      const prevItems = stories[currentStoryIdx - 1]?.items || [];
      setCurrentItemIdx(Math.max(0, prevItems.length - 1));
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    toast({
      title: `Reply sent to ${activeStory?.user.username}!`,
    });
    setReplyText("");
  };

  const handleQuickLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast({
        title: `Liked ${activeStory?.user.username}'s story! ❤️`,
      });
    }
  };

  if (!activeStory || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex-center select-none"
      onClick={onClose}
    >
      {/* Brand Header */}
      <div className="absolute top-4 left-6 z-30 hidden sm:flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-white">MeowBox</span>
        <span className="text-xs text-light-4">• Stories</span>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:right-6 z-30 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next Story Arrows (Desktop) */}
      {currentStoryIdx > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentStoryIdx((prev) => prev - 1);
            setCurrentItemIdx(0);
            setProgress(0);
          }}
          className="absolute left-6 xl:left-24 z-30 p-3 rounded-full bg-dark-3/80 hover:bg-dark-4 text-white hidden md:flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentStoryIdx < stories.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentStoryIdx((prev) => prev + 1);
            setCurrentItemIdx(0);
            setProgress(0);
          }}
          className="absolute right-6 xl:right-24 z-30 p-3 rounded-full bg-dark-3/80 hover:bg-dark-4 text-white hidden md:flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Phone Card */}
      <div
        className="relative w-full max-w-[420px] h-full sm:h-[88vh] max-h-[780px] bg-dark-2 rounded-none sm:rounded-[24px] overflow-hidden shadow-2xl flex flex-col justify-between border-0 sm:border border-dark-4"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Media */}
        <img
          src={currentItem.media}
          alt="Story"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Tap Left / Right Overlay Touch Handlers */}
        <div className="absolute inset-0 grid grid-cols-2 z-10">
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevItem();
            }}
          />
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNextItem();
            }}
          />
        </div>

        {/* Top Header with Progress Bars & Creator Info */}
        <div className="relative z-20 p-4 flex flex-col gap-3">
          {/* Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {activeItems.map((_, idx) => {
              let fillPercent = 0;
              if (idx < currentItemIdx) fillPercent = 100;
              else if (idx === currentItemIdx) fillPercent = progress;

              return (
                <div
                  key={idx}
                  className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* User Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 ring-2 ring-primary-500">
                <AvatarImage src={activeStory.user.imageUrl} />
                <AvatarFallback>{activeStory.user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-white shadow-sm">
                {activeStory.user.username}
              </span>
              <span className="text-[11px] text-white/70">
                {currentItem.timestamp}
              </span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded-full text-white/80 hover:text-white"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Story Footer with Caption & Reply Input */}
        <div className="relative z-20 p-4 flex flex-col gap-3">
          {currentItem.caption && (
            <p className="text-sm font-medium text-white shadow-md leading-relaxed px-1">
              {currentItem.caption}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <form
              onSubmit={handleSendReply}
              className="flex-1 flex items-center bg-dark-1/60 backdrop-blur-md border border-white/20 rounded-full px-4 h-11"
            >
              <input
                type="text"
                placeholder={`Reply to ${activeStory.user.username}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder:text-white/60 focus:outline-none"
              />
              {replyText.trim() && (
                <button type="submit" className="text-primary-500 hover:text-white ml-2">
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>

            <button
              onClick={handleQuickLike}
              className={`p-2.5 rounded-full backdrop-blur-md transition-transform active:scale-125 ${
                isLiked
                  ? "bg-secondary-500/20 text-secondary-500"
                  : "bg-dark-1/60 text-white hover:text-secondary-500 border border-white/20"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-secondary-500 text-secondary-500" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
