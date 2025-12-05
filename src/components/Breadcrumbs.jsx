import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ breadcrumbPath }) => {
  console.log({ breadcrumbPathInComponent: breadcrumbPath });
  if (!breadcrumbPath?.length) return null;

  return (
    <div className="px-4 py-3 mb-4">
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2 text-sm overflow-x-auto">
          {/* Home Icon */}
          <Link
            to="/"
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-md transition-all duration-200 flex-shrink-0 group"
            title="Home"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium hidden sm:inline">Home</span>
          </Link>

          {/* Breadcrumb Items */}
          {breadcrumbPath.map(({ id, name }, idx) => {
            const isLast = idx === breadcrumbPath.length - 1;

            return (
              <div key={id} className="flex items-center gap-2 flex-shrink-0">
                {/* Separator */}
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />

                {/* Breadcrumb Link or Text */}
                {isLast ? (
                  <span className="text-gray-900 font-semibold px-2 py-1.5 bg-blue-50 rounded-md max-w-[200px] truncate">
                    {name}
                  </span>
                ) : (
                  <Link
                    to={`/directory/${id}`}
                    className="text-blue-600 font-medium px-2 py-1.5 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 max-w-[150px] sm:max-w-[200px] truncate"
                    title={name}
                  >
                    {name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
