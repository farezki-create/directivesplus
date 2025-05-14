
import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
};

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/a1404492-f7a0-4402-94ef-36c06c2106e1.png" 
        alt="DirectivesPlus Logo" 
        className="h-12 w-auto"
      />
    </Link>
  );
};

export default Logo;
