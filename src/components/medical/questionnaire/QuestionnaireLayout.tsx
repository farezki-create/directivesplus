
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionnaireLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function QuestionnaireLayout({ title, children }: QuestionnaireLayoutProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
