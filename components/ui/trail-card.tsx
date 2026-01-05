import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TrailCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  mapImageUrl: string;
  title: string;
  location: string;
  difficulty: string;
  creators: string;
  distance: string;
  elevation: string;
  duration: string;
  onDirectionsClick?: () => void;
}

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-sm font-black text-gray-900 leading-tight">{value}</span>
    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{label}</span>
  </div>
);

const TrailCard = React.forwardRef<HTMLDivElement, TrailCardProps>(
  (
    {
      className,
      imageUrl,
      mapImageUrl,
      title,
      location,
      difficulty,
      creators,
      distance,
      elevation,
      duration,
      onDirectionsClick,
      ...props
    },
    ref
  ) => {
    // Filter out standard drag events that conflict with Framer Motion
    const { onDrag, onDragStart, onDragEnd, onDragOver, ...safeProps } = props as any;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-white text-gray-900 shadow-2xl border border-gray-100",
          className
        )}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...safeProps}
      >
        <div className="relative h-64 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
          <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-6">
            <div className="text-white">
              <div className="px-2 py-0.5 rounded bg-blue-600/30 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest w-fit mb-2">
                {difficulty}
              </div>
              <h3 className="text-2xl font-black tracking-tighter leading-none mb-1">{title}</h3>
              <p className="text-sm text-white/70 font-medium">{location}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="default"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 border-none shadow-lg shadow-blue-500/30"
                onClick={onDirectionsClick}
              >
                Join
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">
                {creators}
              </p>
            </div>
            <img
              src={mapImageUrl}
              alt="Network activity"
              className="h-12 w-12 rounded-xl object-cover border border-gray-100 shadow-sm"
            />
          </div>
          <div className="my-6 h-px w-full bg-gray-50" />
          <div className="flex justify-between items-center">
            <StatItem label="Priority" value={distance} />
            <StatItem label="Type" value={elevation} />
            <StatItem label="ETA" value={duration} />
          </div>
        </div>
      </motion.div>
    );
  }
);

TrailCard.displayName = "TrailCard";

export { TrailCard };