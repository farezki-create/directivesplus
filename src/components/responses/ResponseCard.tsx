interface ResponseCardProps {
  title: string;
  children: React.ReactNode;
}

export function ResponseCard({ title, children }: ResponseCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}