
import { Link } from "react-router-dom";

type PageFooterProps = {
  text?: string;
};

const PageFooter = ({ text = "© 2025 DirectivesPlus. Tous droits réservés." }: PageFooterProps) => {
  return (
    <footer className="bg-white py-6 border-t">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500">{text}</p>
        <div className="mt-2 flex justify-center gap-4 text-sm text-gray-500">
          <Link to="/mentions-legales" className="hover:text-directiveplus-600 transition-colors">
            Mentions légales & CGU
          </Link>
          <Link to="/politique-confidentialite" className="hover:text-directiveplus-600 transition-colors">
            Politique de confidentialité
          </Link>
          <a href="mailto:mesdirectives@directivesplus.fr" className="hover:text-directiveplus-600 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
