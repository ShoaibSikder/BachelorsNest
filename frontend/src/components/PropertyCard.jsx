const getImageUrl = (image) =>
  image?.startsWith("http") ? image : `http://127.0.0.1:8000${image}`;

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
  const ownerBlock = (
    <div className="flex items-center gap-3">
      {property.owner?.profile_image ? (
        <img
          src={getImageUrl(property.owner.profile_image)}
          alt="owner"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
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
        className="w-full text-left rounded-xl p-2 transition bg-white dark:bg-gray-900 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label={`View profile of ${property.owner?.username || "owner"}`}
      >
        {ownerBlock}
      </button>
    ) : (
      <div>{ownerBlock}</div>
    );

  const renderImages = () => {
    if (!property.images?.length) {
      return (
        <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
          No image
        </div>
      );
    }

    const openImage = (image) => {
      if (onImageClick) {
        onImageClick(getImageUrl(image));
      }
    };

    if (property.images.length === 1) {
      return (
        <img
          src={getImageUrl(property.images[0].image)}
          alt={`${property.title} 1`}
          className="w-full h-60 object-cover rounded cursor-pointer"
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
              className="w-full h-40 object-cover rounded cursor-pointer"
              onClick={() => openImage(img.image)}
            />
          ))}
        </div>
      );
    }

    if (property.images.length === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-60">
          <img
            src={getImageUrl(property.images[0].image)}
            alt={`${property.title} 1`}
            className="row-span-2 w-full h-full object-cover rounded cursor-pointer"
            onClick={() => openImage(property.images[0].image)}
          />
          <img
            src={getImageUrl(property.images[1].image)}
            alt={`${property.title} 2`}
            className="w-full h-full object-cover rounded cursor-pointer"
            onClick={() => openImage(property.images[1].image)}
          />
          <img
            src={getImageUrl(property.images[2].image)}
            alt={`${property.title} 3`}
            className="w-full h-full object-cover rounded cursor-pointer"
            onClick={() => openImage(property.images[2].image)}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-60 relative">
        {property.images.slice(0, 4).map((img, idx) => (
          <img
            key={idx}
            src={getImageUrl(img.image)}
            alt={`${property.title} ${idx + 1}`}
            className="w-full h-full object-cover rounded cursor-pointer"
            onClick={() => openImage(img.image)}
          />
        ))}
        {property.images.length > 4 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-2xl font-bold rounded">
            +{property.images.length - 4}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col h-full ${className}`}
    >
      <div className="flex items-center justify-between p-4">
        {headerLeft ?? defaultHeaderLeft}
        <div>{headerRight}</div>
      </div>

      {renderImages()}

      <div className="px-2 pt-2 pb-2">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
          {property.title}
        </h3>
        <div className="rounded-2xl bg-white dark:bg-gray-900 p-1 mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            📍 {property.location}
          </p>
        </div>
      </div>

      <div className="px-3 pb-3 flex flex-col flex-grow">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 flex-grow">
          {property.description}
        </p>

        <div className="mt-3 flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-indigo-600">৳ {property.rent}</p>
          {badge}
        </div>
      </div>

      {footer && <div className="px-3 pb-3 mt-auto">{footer}</div>}
    </div>
  );
};

export default PropertyCard;
