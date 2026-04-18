const getImageUrl = (image) =>
  image?.startsWith("http") ? image : `http://127.0.0.1:8000${image}`;

const formatAvailabilityDate = (dateString) => {
  if (!dateString) return "Available now";
  return `Available from ${new Date(dateString).toLocaleDateString()}`;
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const posted = new Date(dateString);
  const diff = Math.floor((now - posted) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return posted.toLocaleDateString();
};

const PropertyCard = ({
  property,
  headerRight,
  headerLeft,
  badge,
  footer,
  onImageClick,
  onOwnerClick,
  className = "",
}) => {
  const showSeatCapacity = property.property_type === "seat";

  const ownerBlock = (
    <div className="flex items-center gap-3">
      {property.owner?.profile_image ? (
        <img
          src={getImageUrl(property.owner.profile_image)}
          alt="owner"
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 font-bold text-white">
          {property.owner?.username?.charAt(0) || "U"}
        </div>
      )}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
          {property.owner?.username || "Unknown Owner"}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatTime(property.created_at)}
        </p>
      </div>
    </div>
  );

  const defaultHeaderLeft =
    onOwnerClick && property.owner ? (
      <button
        type="button"
        onClick={() => onOwnerClick(property.owner)}
        className="w-full rounded-xl bg-white p-2 text-left transition hover:bg-slate-100 dark:bg-gray-900 dark:hover:bg-slate-800"
        aria-label={`View profile of ${property.owner?.username || "owner"}`}
      >
        {ownerBlock}
      </button>
    ) : (
      <div>{ownerBlock}</div>
    );

  const openImage = (image) => {
    if (onImageClick) {
      onImageClick(getImageUrl(image));
    }
  };

  const renderImages = () => {
    if (!property.images?.length) {
      return (
        <div className="flex h-56 w-full items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-700">
          No image
        </div>
      );
    }

    if (property.images.length === 1) {
      return (
        <img
          src={getImageUrl(property.images[0].image)}
          alt={`${property.title} 1`}
          className="h-60 w-full cursor-pointer object-cover rounded"
          onClick={() => openImage(property.images[0].image)}
        />
      );
    }

    if (property.images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {property.images.map((img, idx) => (
            <img
              key={idx}
              src={getImageUrl(img.image)}
              alt={`${property.title} ${idx + 1}`}
              className="h-40 w-full cursor-pointer rounded object-cover"
              onClick={() => openImage(img.image)}
            />
          ))}
        </div>
      );
    }

    if (property.images.length === 3) {
      return (
        <div className="grid h-60 grid-cols-2 grid-rows-2 gap-1">
          <img
            src={getImageUrl(property.images[0].image)}
            alt={`${property.title} 1`}
            className="row-span-2 h-full w-full cursor-pointer rounded object-cover"
            onClick={() => openImage(property.images[0].image)}
          />
          <img
            src={getImageUrl(property.images[1].image)}
            alt={`${property.title} 2`}
            className="h-full w-full cursor-pointer rounded object-cover"
            onClick={() => openImage(property.images[1].image)}
          />
          <img
            src={getImageUrl(property.images[2].image)}
            alt={`${property.title} 3`}
            className="h-full w-full cursor-pointer rounded object-cover"
            onClick={() => openImage(property.images[2].image)}
          />
        </div>
      );
    }

    return (
      <div className="relative grid h-60 grid-cols-2 grid-rows-2 gap-1">
        {property.images.slice(0, 4).map((img, idx) => (
          <img
            key={idx}
            src={getImageUrl(img.image)}
            alt={`${property.title} ${idx + 1}`}
            className="h-full w-full cursor-pointer rounded object-cover"
            onClick={() => openImage(img.image)}
          />
        ))}
        {property.images.length > 4 && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-black/40 text-2xl font-bold text-white">
            +{property.images.length - 4}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-center justify-between p-4">
        {headerLeft ?? defaultHeaderLeft}
        <div>{headerRight}</div>
      </div>

      {renderImages()}

      <div className="px-2 pb-2 pt-2">
        <h3 className="mb-2 text-md font-semibold text-gray-800 dark:text-white">
          {property.title}
        </h3>
        <div className="mb-2 rounded-2xl bg-white p-1 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Location: {property.location}
          </p>
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              property.is_available
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
            }`}
          >
            {property.is_available ? "Available" : "Unavailable"}
          </span>
          {showSeatCapacity && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Vacancy {property.vacancy_count ?? 0}/{property.total_seats ?? 0}
            </span>
          )}
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
            {property.property_type === "seat" ? "Seat" : "Flat"}
          </span>
          {property.saved_count > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
              Saved {property.saved_count}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatAvailabilityDate(property.available_from)}
        </p>
      </div>

      <div className="flex flex-grow flex-col px-3 pb-3">
        <p className="flex-grow text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
          {property.description}
        </p>

        <div className="mb-3 mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-indigo-600">BDT {property.rent}</p>
          {badge}
        </div>
      </div>

      {footer && <div className="mt-auto px-3 pb-3">{footer}</div>}
    </div>
  );
};

export default PropertyCard;
