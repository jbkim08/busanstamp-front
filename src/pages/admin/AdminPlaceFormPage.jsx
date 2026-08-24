import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Link, useNavigate, useParams } from "react-router";

import {
  createAdminPlace,
  getPlace,
  updateAdminPlace,
} from "../../api/placeApi";

import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const INITIAL_FORM = {
  name: "",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
  category: "",
  imageUrl: "",
};

function AdminPlaceFormPage() {
  const { placeId } = useParams(); //장소id를 저장

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditMode = Boolean(placeId); //장소id가 있으면 수정모드

  const [form, setForm] = useState(INITIAL_FORM);

  const [validationError, setValidationError] = useState("");

  const {
    data: place,
    isPending: isPlacePending,
    isError: isPlaceError,
    error: placeError,
  } = useQuery({
    queryKey: ["places", placeId],
    queryFn: () => getPlace(placeId),

    // 등록 화면에서는 상세 조회를 하지 않음
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!place) {
      return;
    }

    setForm({
      name: place.name ?? "",
      description: place.description ?? "",
      address: place.address ?? "",
      latitude: String(place.latitude ?? ""),
      longitude: String(place.longitude ?? ""),
      category: place.category ?? "",
      imageUrl: place.imageUrl ?? "",
    });
  }, [place]);

  const saveMutation = useMutation({
    mutationFn: (placeData) => {
      if (isEditMode) {
        return updateAdminPlace(placeId, placeData);
      }

      return createAdminPlace(placeData);
    },

    onSuccess: async (savedPlace) => {
      await queryClient.invalidateQueries({
        queryKey: ["places"],
      });

      navigate("/admin/places", {
        replace: true,

        state: {
          message: isEditMode
            ? `"${savedPlace.name}" 장소가 수정되었습니다.`
            : `"${savedPlace.name}" 장소가 등록되었습니다.`,
        },
      });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const latitude = Number(form.latitude);

    const longitude = Number(form.longitude);

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      setValidationError("위도는 -90부터 90 사이의 숫자여야 합니다.");

      return;
    }

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      setValidationError("경도는 -180부터 180 사이의 숫자여야 합니다.");

      return;
    }

    saveMutation.mutate({
      name: form.name.trim(),
      description: form.description.trim() || null,
      address: form.address.trim(),
      latitude,
      longitude,
      category: form.category.trim(),
      imageUrl: form.imageUrl.trim() || null,
    });
  };

  if (isEditMode && isPlacePending) {
    return <PageMessage message="관광 장소 정보를 불러오는 중입니다." />;
  }

  if (isEditMode && isPlaceError) {
    return (
      <PageMessage
        message={getApiErrorMessage(
          placeError,
          "관광 장소를 찾을 수 없습니다.",
        )}
      />
    );
  }

  const apiError = saveMutation.isError
    ? getApiErrorMessage(
        saveMutation.error,
        isEditMode
          ? "관광 장소 수정에 실패했습니다."
          : "관광 장소 등록에 실패했습니다.",
      )
    : "";

  return (
    <section>
      <AdminPageHeader
        title={isEditMode ? "관광 장소 수정" : "관광 장소 등록"}
        description={
          isEditMode
            ? "등록된 관광 장소의 정보를 수정합니다."
            : "지도에 표시할 새로운 관광 장소를 등록합니다."
        }
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="장소 이름"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="해운대해수욕장"
            maxLength={100}
            required
          />

          <FormField
            label="카테고리"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="관광명소"
            maxLength={50}
            required
          />

          <div className="md:col-span-2">
            <FormField
              label="주소"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="부산광역시 해운대구 해운대해변로 264"
              maxLength={255}
              required
            />
          </div>

          <FormField
            label="위도"
            type="number"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            placeholder="35.1586975"
            min="-90"
            max="90"
            step="0.0000001"
            required
          />

          <FormField
            label="경도"
            type="number"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            placeholder="129.1603842"
            min="-180"
            max="180"
            step="0.0000001"
            required
          />

          <div className="md:col-span-2">
            <FormField
              label="이미지 URL"
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              maxLength={500}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                장소 설명
              </span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="관광 장소에 대한 설명을 입력해주세요."
                maxLength={2000}
                rows={7}
                className="
                  w-full resize-y rounded-xl
                  border border-slate-300 px-4 py-3
                  outline-none transition
                  focus:border-violet-500
                  focus:ring-4 focus:ring-violet-100
                "
              />

              <span className="mt-1 block text-right text-xs text-slate-400">
                {form.description.length} / 2000
              </span>
            </label>
          </div>
        </div>

        {validationError && <ErrorMessage message={validationError} />}

        {apiError && <ErrorMessage message={apiError} />}

        <ImagePreview imageUrl={form.imageUrl} name={form.name} />

        <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
          <Link
            to="/admin/places"
            className="
              rounded-xl border border-slate-300
              px-5 py-3 font-semibold text-slate-600
              transition hover:bg-slate-100
            "
          >
            취소
          </Link>

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="
              rounded-xl bg-violet-600 px-6 py-3
              font-semibold text-white transition
              hover:bg-violet-500
              disabled:cursor-not-allowed
              disabled:bg-slate-400
            "
          >
            {saveMutation.isPending
              ? "저장 중..."
              : isEditMode
                ? "수정 완료"
                : "장소 등록"}
          </button>
        </div>
      </form>
    </section>
  );
}

function FormField({ label, type = "text", ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        {...inputProps}
        className="
          w-full rounded-xl border border-slate-300
          px-4 py-3 outline-none transition
          focus:border-violet-500
          focus:ring-4 focus:ring-violet-100
        "
      />
    </label>
  );
}

function ImagePreview({ imageUrl, name }) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="mt-7">
      <p className="mb-2 text-sm font-semibold text-slate-700">
        이미지 미리보기
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img
          src={imageUrl}
          alt={name || "장소 이미지 미리보기"}
          className="h-72 w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

function PageMessage({ message }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
      {message}
    </div>
  );
}

export default AdminPlaceFormPage;
