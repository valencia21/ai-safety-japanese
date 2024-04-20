import { Button } from "@lemonsqueezy/wedges";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export const FlashcardButton = () => {
  return (
    <Button
      className="mt-4 text-xs bg-lwgreen hover:bg-lwgreenlight text-lwgreendark"
      size="sm"
      after={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}
    >
      理解度チェック（英語）
    </Button>
  );
};
