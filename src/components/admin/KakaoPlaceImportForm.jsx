import { useEffect, useState } from "react";
import { Image, MapPin, X } from "lucide-react";

function KakaoPlaceImportForm({ place, isSaving, error, onSave, onCancel }) {
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setDescription("");
    setImageUrl("");
  }, [place]);

  if (!place) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <MapPin className="mx-auto text-slate-300" />

        <p className="mt-3 text-sm text-slate-500">
          검색 결과에서 등록할 장소를 선택해주세요.
        </p>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      kakaoPlaceId: place.kakaoPlaceId,
      name: place.name,

      categoryName: place.categoryName || null,

      categoryGroupName: place.categoryGroupName || null,

      phone: place.phone || null,

      address: place.address || null,

      roadAddress: place.roadAddress || null,

      longitude: place.longitude,

      latitude: place.latitude,

      placeUrl: place.placeUrl || null,

      description: description.trim() || null,

      imageUrl: imageUrl.trim() || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        sticky top-6 rounded-2xl
        border border-slate-200
        bg-white p-6 shadow-sm
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-violet-600">선택한 장소</p>

          <h2 className="mt-1 text-xl font-bold">{place.name}</h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
        <InfoRow label="주소" value={place.roadAddress || place.address} />

        <InfoRow
          label="카테고리"
          value={place.categoryGroupName || place.categoryName}
        />

        <InfoRow label="전화번호" value={place.phone || "-"} />

        <InfoRow label="위도" value={place.latitude} />

        <InfoRow label="경도" value={place.longitude} />
      </div>

      <div className="mt-6">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            장소 설명
          </span>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="관광 장소에 대한 설명을 입력해주세요."
            className="
              w-full rounded-xl
              border border-slate-300
              px-4 py-3 outline-none
              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-100
            "
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {description.length} / 2000
          </p>
        </label>
      </div>

      <div className="mt-5">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            이미지 URL
          </span>

          <div className="relative">
            <Image
              size={18}
              className="
                absolute left-4 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              className="
                w-full rounded-xl
                border border-slate-300
                py-3 pl-11 pr-4
                outline-none
                focus:border-violet-500
                focus:ring-4
                focus:ring-violet-100
              "
            />
          </div>
        </label>
      </div>

      {imageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={imageUrl}
            alt="장소 미리보기"
            className="h-40 w-full object-cover"
          />
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="
          mt-6 w-full rounded-xl
          bg-violet-600 px-5 py-3
          font-semibold text-white
          transition hover:bg-violet-500
          disabled:cursor-not-allowed
          disabled:bg-slate-400
        "
      >
        {isSaving ? "등록 중..." : "이 장소 등록하기"}
      </button>
    </form>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3">
      <span className="font-semibold text-slate-500">{label}</span>

      <span className="break-all text-slate-800">{value}</span>
    </div>
  );
}

export default KakaoPlaceImportForm;
