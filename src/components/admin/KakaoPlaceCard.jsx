import { ExternalLink, MapPin, Phone, Plus } from "lucide-react";

function KakaoPlaceCard({ place, onSelect, selected }) {
  const address = place.roadAddress || place.address;

  return (
    <article
      className={`
        rounded-2xl border bg-white p-5 transition
        ${
          selected
            ? "border-violet-500 ring-4 ring-violet-100"
            : "border-slate-200 hover:border-violet-300"
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-violet-600">
            {place.categoryGroupName || "카카오 장소"}
          </span>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {place.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onSelect(place)}
          className="
            flex shrink-0 items-center gap-1
            rounded-lg bg-violet-600 px-3 py-2
            text-sm font-semibold text-white
            transition hover:bg-violet-500
          "
        >
          <Plus size={16} />

          {selected ? "선택됨" : "등록"}
        </button>
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
        <MapPin size={17} className="mt-0.5 shrink-0 text-slate-400" />

        {address}
      </p>

      {place.phone && (
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Phone size={16} className="text-slate-400" />

          {place.phone}
        </p>
      )}

      <p className="mt-3 text-xs leading-5 text-slate-400">
        {place.categoryName}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs text-slate-400">
          <span>위도 {place.latitude}</span>

          <span className="mx-2">·</span>

          <span>경도 {place.longitude}</span>
        </div>

        {place.placeUrl && (
          <a
            href={place.placeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm font-semibold text-blue-600"
          >
            카카오맵
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export default KakaoPlaceCard;
