import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Edit3, MapPin, QrCode, Search, Trash2 } from "lucide-react";

import { Link } from "react-router";

import { deleteAdminPlace, getPlaces } from "../../api/placeApi";

import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const INITIAL_SEARCH = {
  keyword: "",
  category: "",
};

function AdminPlaceListPage() {
  const queryClient = useQueryClient();

  // 입력 중인 검색값
  const [searchForm, setSearchForm] = useState(INITIAL_SEARCH);

  // 실제 API에 적용된 검색값
  const [searchParams, setSearchParams] = useState(INITIAL_SEARCH);

  const {
    data: places = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["places", "admin", searchParams],

    queryFn: () =>
      getPlaces({
        keyword: searchParams.keyword || undefined,

        category: searchParams.category || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPlace,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["places"],
      });
    },
  });

  const handleSearchChange = (event) => {
    const { name, value } = event.target;

    setSearchForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();

    setSearchParams({
      keyword: searchForm.keyword.trim(),
      category: searchForm.category.trim(),
    });
  };

  const handleReset = () => {
    setSearchForm(INITIAL_SEARCH);
    setSearchParams(INITIAL_SEARCH);
  };

  const handleDelete = (place) => {
    const confirmed = window.confirm(
      `"${place.name}" 장소를 삭제하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(place.placeId);
  };

  return (
    <section>
      <AdminPageHeader
        title="관광 장소 관리"
        description="등록된 관광 장소를 조회하고 수정할 수 있습니다."
        buttonText="새 장소 등록"
        buttonLink="/admin/places/new"
      />

      <SearchForm
        searchForm={searchForm}
        onChange={handleSearchChange}
        onSubmit={handleSearch}
        onReset={handleReset}
      />

      {deleteMutation.isError && (
        <ErrorMessage
          message={getApiErrorMessage(
            deleteMutation.error,
            "관광 장소 삭제에 실패했습니다.",
          )}
        />
      )}

      {isPending && <PageMessage message="관광 장소를 불러오는 중입니다." />}

      {isError && (
        <PageMessage
          message={getApiErrorMessage(
            error,
            "관광 장소를 불러오지 못했습니다.",
          )}
        />
      )}

      {!isPending && !isError && places.length === 0 && (
        <PageMessage message="검색된 관광 장소가 없습니다." />
      )}

      {!isPending && !isError && places.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-500">
            총 <strong className="text-slate-800">{places.length}</strong>
            개의 장소
          </p>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="hidden grid-cols-[90px_1fr_160px_160px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500 md:grid">
              <span>번호</span>
              <span>장소</span>
              <span>카테고리</span>
              <span>관리</span>
            </div>

            <div className="divide-y divide-slate-200">
              {places.map((place) => (
                <AdminPlaceRow
                  key={place.placeId}
                  place={place}
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === place.placeId
                  }
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function SearchForm({ searchForm, onChange, onSubmit, onReset }) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-7 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_240px_auto]">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">
            검색어
          </span>

          <input
            type="search"
            name="keyword"
            value={searchForm.keyword}
            onChange={onChange}
            placeholder="장소 이름 또는 주소"
            className="
              w-full rounded-xl border border-slate-300
              px-4 py-3 outline-none transition
              focus:border-violet-500
              focus:ring-4 focus:ring-violet-100
            "
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-600">
            카테고리
          </span>

          <input
            type="text"
            name="category"
            value={searchForm.category}
            onChange={onChange}
            placeholder="관광명소"
            className="
              w-full rounded-xl border border-slate-300
              px-4 py-3 outline-none transition
              focus:border-violet-500
              focus:ring-4 focus:ring-violet-100
            "
          />
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="
              flex items-center gap-2 rounded-xl
              bg-slate-900 px-5 py-3
              font-semibold text-white transition
              hover:bg-slate-700
            "
          >
            <Search size={18} />
            검색
          </button>

          <button
            type="button"
            onClick={onReset}
            className="
              rounded-xl border border-slate-300
              px-4 py-3 font-semibold text-slate-600
              transition hover:bg-slate-100
            "
          >
            초기화
          </button>
        </div>
      </div>
    </form>
  );
}

function AdminPlaceRow({ place, isDeleting, onDelete }) {
  return (
    <article className="grid gap-4 px-5 py-5 md:grid-cols-[90px_1fr_120px_220px] md:items-center">
      <div className="text-sm font-semibold text-slate-400">
        #{place.placeId}
      </div>

      <div className="flex min-w-0 items-center gap-4">
        <PlaceThumbnail place={place} />

        <div className="min-w-0">
          <h2 className="truncate font-bold text-slate-900">{place.name}</h2>

          <p className="mt-1 flex items-start gap-1 text-sm text-slate-500">
            <MapPin className="mt-0.5 size-4 shrink-0" />

            <span className="line-clamp-2">{place.address}</span>
          </p>
        </div>
      </div>

      <div>
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
          {place.category}
        </span>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/admin/places/${place.placeId}/qr`}
          className="
            flex items-center gap-1
            rounded-lg
            border border-violet-200
            px-3 py-2
            text-sm font-semibold
            text-violet-600
            hover:bg-violet-50
          "
        >
          <QrCode size={16} />
          QR
        </Link>

        <Link
          to={`/admin/places/${place.placeId}/edit`}
          className="
            flex items-center gap-1 rounded-lg
            border border-slate-300 px-3 py-2
            text-sm font-semibold text-slate-600
            transition hover:bg-slate-100
          "
        >
          <Edit3 size={16} />
          수정
        </Link>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(place)}
          className="
            flex items-center gap-1 rounded-lg
            border border-red-200 px-3 py-2
            text-sm font-semibold text-red-600
            transition hover:bg-red-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Trash2 size={16} />

          {isDeleting ? "삭제 중" : "삭제"}
        </button>
      </div>
    </article>
  );
}

function PlaceThumbnail({ place }) {
  if (!place.imageUrl) {
    return (
      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
        이미지 없음
      </div>
    );
  }

  return (
    <img
      src={place.imageUrl}
      alt={place.name}
      className="size-16 shrink-0 rounded-xl object-cover"
    />
  );
}

function PageMessage({ message }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
      {message}
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

export default AdminPlaceListPage;
