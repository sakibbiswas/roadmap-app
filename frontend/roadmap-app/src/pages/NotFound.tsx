
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-4">Sorry, the page you requested does not exist.</p>
      <Link
        to="/"
        className="text-blue-600 hover:underline"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
