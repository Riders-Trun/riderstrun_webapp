import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import RideCard from "./RideCard";
import type { Ride } from "@/types";

interface VirtualizedRideListProps {
  rides: Ride[];
}

const ESTIMATED_ITEM_HEIGHT = 280;
const VIRTUALIZATION_THRESHOLD = 20;

const VirtualizedRideList = ({ rides }: VirtualizedRideListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rides.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT,
    overscan: 5,
  });

  // For small lists, render normally without virtualization overhead
  if (rides.length < VIRTUALIZATION_THRESHOLD) {
    return (
      <div className="space-y-3">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="overflow-auto"
      style={{ maxHeight: "calc(100vh - 300px)" }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={rides[virtualItem.index].id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className="pb-3">
              <RideCard ride={rides[virtualItem.index]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedRideList;
