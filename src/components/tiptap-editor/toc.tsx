import { TextSelection } from "@tiptap/pm/state";

// First, let's define an interface for the ToC item
interface ToCItemType {
  id: string;
  isActive: boolean;
  isScrolledOver: boolean;
  level: number;
  textContent: string;
  itemIndex?: number;
}

// Update the ToCItem component props
interface ToCItemProps {
  item: ToCItemType;
  onItemClick: (e: React.MouseEvent, id: string) => void;
  index?: number;
}

// @ts-ignore
export const ToCItem = ({ item, onItemClick }: ToCItemProps) => {
  console.log('ToC Item State:', {
    id: item.id,
    isActive: item.isActive,
    isScrolledOver: item.isScrolledOver,
    level: item.level,
    textContent: item.textContent
  });

  return (
    <div
      className={`${item.isActive && !item.isScrolledOver ? "is-active" : ""} ${
        item.isScrolledOver ? "is-scrolled-over" : ""
      }`}
      style={{
        ["--level" as string]: item.level,
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
      <p>Start editing your document to see the outline.</p>
    </div>
  );
};

interface ToCProps {
  items?: ToCItemType[];
  editor: any; // You might want to properly type this based on your editor type
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
      {items.map((item, i) => (
        <ToCItem
          onItemClick={onItemClick}
          key={item.id}
          item={item}
          index={i + 1}
        />
      ))}
    </>
  );
};
