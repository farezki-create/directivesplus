
import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
};

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 via-transparent to-purple-600 flex items-center justify-center">
          <div className="text-3xl font-bold italic text-black">D</div>
        </div>
      </div>
      <span className="ml-2 text-xl font-bold text-blue-600">DIRECTIVESPLUS</span>
    </Link>
  );
};

export default Logo;
