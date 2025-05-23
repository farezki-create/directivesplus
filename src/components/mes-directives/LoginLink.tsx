
import React from "react";

const LoginLink = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-gray-500">
        Si vous avez un compte, vous pouvez également{" "}
        <a href="/auth" className="text-directiveplus-600 hover:underline">
          vous connecter
        </a>
        {" "}pour accéder à vos directives.
      </p>
    </div>
  );
};

export default LoginLink;
