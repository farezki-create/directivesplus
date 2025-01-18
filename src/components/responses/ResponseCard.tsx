import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ResponseCardProps {
  title: string;
  children: React.ReactNode;
}

export function ResponseCard({ title, children }: ResponseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}