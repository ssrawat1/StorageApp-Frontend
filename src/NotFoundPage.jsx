import { useRouteError, Link } from 'react-router-dom';
import { FaHome, FaRedoAlt } from 'react-icons/fa';

function statusTitle(status) {
  switch (status) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Access Denied';
    case 404:
      return 'Page Not Found';
    case 429:
      return 'Too Many Requests';
    default:
      return 'Something Went Wrong';
  }
}

function friendlyMessage(status) {
  switch (status) {
    case 400:
      return 'The page request wasn’t understood. Try again.';
    case 401:
      return 'You must be signed in to view this page.';
    case 403:
      return 'You don’t have permission to access this content.';
    case 404:
      return 'The page you’re looking for doesn’t exist.';
    case 429:
      return "You're doing that too fast. Please try again shortly.";
    default:
      return 'There was an unexpected problem. Please try again.';
  }
}

export default function NotFoundPage() {
  const routeError = useRouteError();
  const status = routeError?.status || routeError?.statusCode || 500;

  const title = statusTitle(status);
  const message = friendlyMessage(status);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Error ${status} - safemystuff.store`,
    description: `${status} - ${title}`,
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <main
        aria-labelledby="error-heading"
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6"
      >
        <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-8 sm:p-10">
          <header className="flex items-start gap-4">
            <div className="flex-none bg-red-50 text-red-600 rounded-full w-14 h-14 flex items-center justify-center text-lg font-semibold">
              {status}
            </div>

            <div>
              <h1 id="error-heading" className="text-2xl font-semibold text-gray-900">
                {title}
              </h1>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>
          </header>

          <section className="mt-8">
            <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-800">What you can do</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>Check the URL for mistakes.</li>
                <li>Return to the homepage or refresh the page.</li>
              </ul>
            </div>
          </section>

          {/* Buttons stacked vertically */}
          <div className="mt-8 flex flex-col gap-3 w-full">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium"
            >
              <FaHome className="w-4 h-4" />
              Go to Home
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium"
            >
              <FaRedoAlt className="w-4 h-4" />
              Refresh Page
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
