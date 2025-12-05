import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ directoriesList }) => {
  console.log({directoriesList})
  if (!directoriesList?.length) return;
  const { breadcrumb } = directoriesList[0];

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-wrap items-center gap-1 text-sm text-gray-700 font-medium">
        {breadcrumb.map(({ id, name }, idx) => {
          const isLast = idx === breadcrumb.length - 1;

          return (
            <div key={id} className="flex items-center gap-1 max-w-[150px] truncate">
              {isLast ? (
                <span className="text-gray-900 truncate">{name}</span>
              ) : (
                <Link
                  to={`/directory/${id}`}
                  className="text-blue-600 px-1.5 py-0.5 rounded truncate 
                  hover:bg-gray-100 
                  focus:bg-gray-100 active:bg-gray-200 no-underline"
                >
                  {name}
                </Link>
              )}
              {!isLast && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumbs;
