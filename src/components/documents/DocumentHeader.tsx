
interface DocumentHeaderProps {
  title: string;
  showActions?: boolean;
  documentId?: string;
}

export function DocumentHeader({ title, showActions = true, documentId }: DocumentHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
