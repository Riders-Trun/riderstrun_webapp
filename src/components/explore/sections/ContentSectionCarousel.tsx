import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentSectionCarouselProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  onViewAll?: () => void;
  children: React.ReactNode;
  itemWidth?: number;
  gap?: number;
  showControls?: boolean;
}

const ContentSectionCarousel = ({
  title,
  subtitle,
  viewAllLink,
  onViewAll,
  children,
  itemWidth = 280,
  gap = 16,
  showControls = true
}: ContentSectionCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -itemWidth - gap : itemWidth + gap;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      
      // Update scroll buttons after animation
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {(viewAllLink || onViewAll) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-orange-500"
            onClick={onViewAll}
            asChild={!!viewAllLink}
          >
            {viewAllLink ? <a href={viewAllLink}>View All</a> : "View All"}
          </Button>
        )}
      </div>

      {/* Carousel container */}
      <div className="relative">
        {/* Scroll controls */}
        {showControls && (
          <>
            <Button
              variant="outline"
              size="icon"
              className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm ${
                !canScrollLeft ? "opacity-0 pointer-events-none" : ""
              }`}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm ${
                !canScrollRight ? "opacity-0 pointer-events-none" : ""
              }`}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Scrollable content */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-4 -mx-4"
          style={{ scrollbarWidth: "none" }}
          onScroll={checkScrollability}
        >
          {/* Apply gap and width to children */}
          {Array.isArray(children)
            ? children.map((child, index) => (
                <div
                  key={index}
                  className="flex-none snap-start"
                  style={{ width: itemWidth, marginRight: gap }}
                >
                  {child}
                </div>
              ))
            : children}
        </div>
      </div>
    </div>
  );
};

export default ContentSectionCarousel;