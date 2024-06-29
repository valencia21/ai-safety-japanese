import React, { useEffect, useRef, useState, useCallback } from "react";

interface SidenotesProps {
  sidenotes: Record<string, string>;
  sidenotePositions: Array<{ id: number; pos: number; yCoordinate: number }>;
  editorTopPosition: number | null;
}

export const Sidenotes: React.FC<SidenotesProps> = ({
  sidenotes,
  sidenotePositions,
  editorTopPosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>(
    {}
  );
  const [, forceUpdate] = useState({});

  const adjustOverlap = useCallback(() => {
    if (editorTopPosition === null || !containerRef.current) return;

    const sidenoteElements = containerRef.current.children;

    // Reset all positions to their initial state
    for (let i = 0; i < sidenoteElements.length; i++) {
      const element = sidenoteElements[i] as HTMLElement;
      const position = sidenotePositions[i];
      if (position) {
        const initialTop = Math.max(
          0,
          position.yCoordinate - editorTopPosition
        );
        element.style.top = `${initialTop}px`;
      }
    }

    // Recalculate overlap
    for (let i = 1; i < sidenoteElements.length; i++) {
      const currentElement = sidenoteElements[i] as HTMLElement;
      const previousElement = sidenoteElements[i - 1] as HTMLElement;

      const currentRect = currentElement.getBoundingClientRect();
      const previousRect = previousElement.getBoundingClientRect();

      if (currentRect.top < previousRect.bottom) {
        const overlap = previousRect.bottom - currentRect.top;
        const currentTop = parseInt(currentElement.style.top || "0", 10);
        currentElement.style.top = `${currentTop + overlap + 20}px`;
      }
    }
  }, [editorTopPosition, sidenotePositions]);

  useEffect(() => {
    adjustOverlap();
  }, [sidenotePositions, editorTopPosition, expandedNotes, adjustOverlap]);

  const toggleExpand = (key: string) => {
    setExpandedNotes((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      // Force a re-render after state update
      setTimeout(() => forceUpdate({}), 0);
      return newState;
    });
  };

  if (editorTopPosition === null) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {sidenotePositions.map(({ id, yCoordinate }) => {
        const key = id.toString();
        if (!sidenotes[key]) return null;

        const initialTop = Math.max(0, yCoordinate - editorTopPosition);
        const isExpanded = expandedNotes[key];
        const truncatedText = sidenotes[key].slice(0, 100);
        const showMoreButton = sidenotes[key].length > 100;

        return (
          <div
            key={key}
            className="absolute left-0 right-0 flex flex-row gap-x-2 py-4 border border-y-blue-700 border-x-0"
            style={{
              top: `${initialTop}px`,
            }}
          >
            <div className="flex items-top justify-center text-xs text-blue-700">
              {key}.
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-xs text-gray-900">
                {isExpanded ? sidenotes[key] : truncatedText}
                {showMoreButton && !isExpanded && "..."}
              </p>
              {showMoreButton && (
                <button
                  className="text-left text-xs text-gray-700 font-bold"
                  onClick={() => toggleExpand(key)}
                >
                  {isExpanded ? "閉じる" : "続きを読む"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
