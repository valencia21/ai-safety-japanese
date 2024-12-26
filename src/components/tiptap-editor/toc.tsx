import { TextSelection } from "@tiptap/pm/state";
import type { MouseEvent } from "react";

interface ToCItemProps {
  item: {
    id: string;
    level: number;
    isActive: boolean;
    isScrolledOver: boolean;
    itemIndex: number;
    textContent: string;
  };
  onItemClick: (e: MouseEvent, id: string) => void;
}

export const ToCItem = ({ item, onItemClick }: ToCItemProps) => {
  return (
    <div
      className={`${item.isActive && !item.isScrolledOver ? "is-active" : ""} ${
        item.isScrolledOver ? "is-scrolled-over" : ""
      }`}
      style={{
        // @ts-ignore
        "--level": item.level,
      }}
    >
      <a
        href={`#${item.id}`}
        onClick={(e) => onItemClick(e, item.id)}
        data-item-index={item.itemIndex}
      >
        {item.isActive && !item.isScrolledOver && (
          <span className="text-red-600 font-bold">&gt;</span>
        )}
        <span>{item.textContent}</span>
      </a>
    </div>
  );
};

export const ToCEmptyState = () => {
  return (
    <div className="empty-state">
      <p>This text has no table of contents.</p>
    </div>
  );
};

interface ToCProps {
  items: Array<{
    id: string;
    level: number;
    isActive: boolean;
    isScrolledOver: boolean;
    itemIndex: number;
    textContent: string;
  }>;
  editor: any; // You might want to replace 'any' with the proper editor type from TipTap
}

export const ToC = ({ items = [], editor }: ToCProps) => {
  if (items.length === 0) {
    return <ToCEmptyState />;
  }

  const onItemClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"]`);
      const pos = editor.view.posAtDOM(element, 0);

      const tr = editor.view.state.tr;
      tr.setSelection(new TextSelection(tr.doc.resolve(pos)));
      editor.view.dispatch(tr);
      editor.view.focus();

      if (history.pushState) {
        history.pushState(null, "", `#${id}`);
      }

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {items.map((item) => (
        <ToCItem
          onItemClick={onItemClick}
          key={item.id}
          item={item}
        />
      ))}
    </>
  );
};
