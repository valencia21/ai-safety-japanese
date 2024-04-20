import { Button } from "@lemonsqueezy/wedges";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

interface LinkToOriginalButtonProps {
  href: string;
}

export const LinkToOriginalButton: React.FC<LinkToOriginalButtonProps> = ({
  href,
}) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button
        className="text-xs bg-red-700 text-white hover:bg-red-500"
        size="sm"
        after={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}
      >
        原文（英語）
      </Button>
    </a>
  );
};
