import React, { useEffect, useRef, useState, useCallback } from "react";

interface SidenotesProps {
  sidenotes: Record<string, string>;
  sidenotePositions: Array<{ id: number; pos: number; yCoordinate: number }>;
  editorTopPosition: number | null;
}

const truncateHtml = (html: string, maxLength: number): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  
  if (text.length <= maxLength) {
    return html;
  }

  let truncated = '';
  let currentLength = 0;
  let inTag = false;
  
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    
    if (char === '<') {
      inTag = true;
    }
    
    truncated += char;
    
    if (!inTag) {
      currentLength++;
      if (currentLength >= maxLength) {
        // Find the end of the current tag if we're in one
        while (i < html.length && html[i] !== '>') {
          i++;
          truncated += html[i];
        }
        break;
      }
    }
    
    if (char === '>') {
      inTag = false;
    }
  }

  // Close any open tags
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = truncated;
  return tempDiv.innerHTML;
};

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
        const showMoreButton = (sidenotes[key].length > 100);
        const displayContent = isExpanded 
          ? sidenotes[key] 
          : truncateHtml(sidenotes[key], 100);

        return (
          <div
            key={key}
            className="absolute left-0 right-0 flex flex-row gap-x-2 py-4 pr-4 border border-y-red-700 border-x-0"
            style={{
              top: `${initialTop}px`,
            }}
          >
            <div className="flex items-top justify-center text-xs text-red-700">
              {key}.
            </div>
            <div className="flex flex-col gap-y-1">
              <div 
                className="text-xs text-gray-900 prose prose-sm"
                dangerouslySetInnerHTML={{ 
                  __html: displayContent + (showMoreButton && !isExpanded ? '...' : '')
                }} 
              />
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