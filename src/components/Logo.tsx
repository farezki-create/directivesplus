import { Link } from "react-router-dom";
type LogoProps = {
  className?: string;
};
const Logo = ({
  className = ""
}: LogoProps) => {
  return <Link to="/" className={`flex items-center ${className}`}>
      
    </Link>;
};
export default Logo;