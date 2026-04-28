interface LinkToOriginalButtonProps {
  href: string;
}

export const LinkToOriginalButton: React.FC<LinkToOriginalButtonProps> = ({
  href,
}) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <div className="text-sm text-red-700 hover:text-red-900">英語の原文</div>
    </a>
  );
};
