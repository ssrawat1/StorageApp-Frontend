import { useEffect, useState } from 'react';

export const formatSize = (bytes = 0) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  const TB = GB * 1024;

  if (bytes < KB) return `${bytes} Bytes`;
  if (bytes < MB) return `${(bytes / KB).toFixed(2)} KB`;
  if (bytes < GB) return `${(bytes / MB).toFixed(2)} MB`;
  if (bytes < TB) return `${(bytes / GB).toFixed(2)} GB`;
  return `${(bytes / TB).toFixed(2)} TB`;
};

function Breadcrumb({ rawPath, onCopy }) {
  // split & clean
  const segments = rawPath.split('/').filter(Boolean);
  // map root- -> My Drive for display but keep original for title/copy
  const displaySegments = segments.map((s, i) =>
    i === 0 && s.startsWith('root-') ? 'My Drive' : s
  );

  const [expanded, setExpanded] = useState(false);

  // if too many segments, show first + ... + last 3
  const shouldTruncate = displaySegments.length > 5 && !expanded;
  const visibleSegments = shouldTruncate
    ? [displaySegments[0], '...', ...displaySegments.slice(-3)]
    : displaySegments;

  const fullPath = '/' + segments.join('/');

  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className="flex items-center gap-2 overflow-hidden"
        title={fullPath}
      >
        {visibleSegments.map((seg, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center max-w-[10rem] truncate ${seg === '...' ? 'opacity-70' : ''}`}
          >
            <span className="truncate">{seg}</span>
            {idx < visibleSegments.length - 1 && (
              <span className="px-2 select-none">/</span>
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs underline hover:no-underline"
            aria-label="Show full path"
          >
            Show full
          </button>
        )}
        {expanded && displaySegments.length > 5 && (
          <button
            onClick={() => setExpanded(false)}
            className="text-xs underline hover:no-underline"
            aria-label="Collapse path"
          >
            Collapse
          </button>
        )}

        <button
          onClick={() => onCopy(fullPath)}
          className="text-xs bg-gray-100 px-2 py-1 rounded shadow-sm hover:bg-gray-200"
          aria-label="Copy full path"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default function DetailsPopup({ item, onClose }) {
  if (!item) return null;

  const {
    id,
    name,
    isDirectory,
    createdAt,
    updatedAt,
    size,
    path,
    totalFiles,
    totalFolders,
    totalItems,
  } = item;

  // sanitize path to ensure it starts with '/'
  const rawPath = path.startsWith('/') ? path : '/' + path;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // small feedback could be added, e.g. toast - left minimal here
      // alert('Path copied to clipboard');
    } catch (err) {
      console.error('copy failed', err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Details</h2>

        {/* content area: prevents overflow by limiting height and enabling internal scroll */}
        <div className="space-y-4 text-sm max-h-[70vh] overflow-auto pr-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <span className="font-semibold">Name:</span>{' '}
                <span className="break-words">{name}</span>
              </div>

              <div className="mb-2">
                <span className="font-semibold">Path:</span>
                <div className="mt-1">
                  <Breadcrumb rawPath={rawPath} onCopy={handleCopy} />
                </div>
              </div>

              <div className="mb-2">
                <span className="font-semibold">Size:</span> {formatSize(size)}
              </div>
            </div>

            <div className="w-full sm:w-56">
              <div>
                <span className="font-semibold">Created At:</span>{' '}
                <div className="mt-1 text-xs text-gray-600">{new Date(createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-3">
                <span className="font-semibold">Updated At:</span>{' '}
                <div className="mt-1 text-xs text-gray-600">{new Date(updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {isDirectory && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="font-semibold">Files:</span>
                <div className="mt-1 text-sm text-gray-700">{totalFiles ?? 0}</div>
              </div>
              <div>
                <span className="font-semibold">Folders:</span>
                <div className="mt-1 text-sm text-gray-700">{totalFolders ?? 0}</div>
              </div>
              <div>
                <span className="font-semibold">Total Items:</span>
                <div className="mt-1 text-sm text-gray-700">{totalItems ?? 0}</div>
              </div>
            </div>
          )}

          {/* fallback ID shown for debugging or reference */}
          <div className="text-xs text-gray-500 break-all">ID: {id}</div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
