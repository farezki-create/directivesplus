
type PageFooterProps = {
  text?: string;
};

const PageFooter = ({ text = "© 2025 DirectivesPlus. Tous droits réservés." }: PageFooterProps) => {
  return (
    <footer className="bg-white py-6 border-t">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>{text}</p>
      </div>
    </footer>
  );
};

export default PageFooter;
