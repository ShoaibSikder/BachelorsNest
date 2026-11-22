import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, MapPin } from "lucide-react";
import { getMediaUrl } from "../config";

const getImageUrl = (image) =>
  getMediaUrl(image);

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
  const [index, setIndex] = useState(0);
  const photos = property.images || [];
  const active = Math.min(index, Math.max(0, photos.length - 1));
  const showSeatCapacity = property.property_type === "seat";

  const ownerBlock = (
    <div className="flex items-center gap-3">
      {property.owner?.profile_image ? (
        <img
          src={getImageUrl(property.owner.profile_image)}
          alt="owner"
          loading="lazy"
          decoding="async"
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

  return <article className={`bn-listing ${className}`}>
    <div className="bn-listing-head">{headerLeft ?? defaultHeaderLeft}{headerRight}</div>
    <div className="bn-gallery">{photos.length ? <>
      <button type="button" aria-label={`View photo ${active + 1} of ${property.title}`} onClick={() => openImage(photos[active].image)} disabled={!onImageClick}>
        <img loading="lazy" src={getImageUrl(photos[active].image)} alt={`${property.title}, photo ${active + 1}`}/>
      </button>
      {photos.length > 1 && <div className="bn-pager"><button aria-label="Previous photo" onClick={()=>setIndex((active + photos.length - 1) % photos.length)}><ChevronLeft size={17}/></button><span>{active + 1} / {photos.length}</span><button aria-label="Next photo" onClick={()=>setIndex((active + 1) % photos.length)}><ChevronRight size={17}/></button></div>}
    </> : <span className="bn-noimage"><ImageIcon/>No photo available</span>}</div>
    <div className="bn-details"><div className="bn-row bn-wrap"><span className="bn-chip">{showSeatCapacity ? "Seat" : "Flat"}</span><span className={property.is_available ? "bn-available" : "bn-muted"}>{property.is_available ? "Available" : "Unavailable"}</span>{badge}</div>
      <h3>{property.title}</h3><p className="bn-location"><MapPin size={15}/>{property.location}</p>
      <p className="bn-muted line-clamp-2">{property.description}</p>
      <p className="bn-meta">{formatAvailabilityDate(property.available_from)}{showSeatCapacity && ` · ${property.vacancy_count ?? 0}/${property.total_seats} seats free`}{property.saved_count > 0 && ` · ${property.saved_count} saved`}</p>
      <strong className="bn-price">BDT {Number(property.rent).toLocaleString("en-BD")}</strong>
    </div>{footer && <div className="bn-listing-foot">{footer}</div>}
  </article>;
};
export default PropertyCard;
