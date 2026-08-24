import { MapPin, Navigation } from "lucide-react";

import { Link } from "react-router";

function MapPlaceCard({ place, selected, onClick }) {
  return (
    <article
      onClick={() => onClick(place)}
      className={`
        cursor-pointer overflow-hidden
        rounded-2xl border bg-white
        transition
        ${
          selected
            ? "border-blue-500 ring-4 ring-blue-100"
            : "border-slate-200 hover:border-blue-300"
        }
      `}
    >
      {place.imageUrl && (
        <img
          src={place.imageUrl}
          alt={place.name}
          className="h-36 w-full object-cover"
        />
      )}

      <div className="p-4">
        <span className="text-xs font-semibold text-blue-600">
          {place.category}
        </span>

        <h2 className="mt-1 font-bold text-slate-900">{place.name}</h2>

        <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
          <MapPin size={16} className="mt-0.5 shrink-0" />

          <span>{place.address}</span>
        </p>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClick(place);
            }}
            className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-blue-600"
          >
            <Navigation size={15} />
            지도에서 보기
          </button>

          <Link
            to={`/places/${place.placeId}`}
            onClick={(event) => event.stopPropagation()}
            className="text-sm font-semibold text-blue-600"
          >
            상세보기
          </Link>
        </div>
      </div>
    </article>
  );
}

export default MapPlaceCard;
