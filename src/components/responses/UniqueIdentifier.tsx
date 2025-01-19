interface UniqueIdentifierProps {
  userId: string;
}

export function UniqueIdentifier({ userId }: UniqueIdentifierProps) {
  return (
    <div className="mt-8 pt-4 border-t">
      <p className="text-sm text-muted-foreground">
        Identifiant unique : {userId}
      </p>
    </div>
  );
}