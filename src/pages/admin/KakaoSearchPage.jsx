import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, SearchX } from "lucide-react";
import { useNavigate } from "react-router";
import { importKakaoPlace, searchKakaoPlaces } from "../../api/kakaoApi";

import AdminPageHeader from "../../components/admin/AdminPageHeader";
import KakaoPlaceCard from "../../components/admin/KakaoPlaceCard";
import KakaoPlaceImportForm from "../../components/admin/KakaoPlaceImportForm";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

function KakaoSearchPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState("");

  const [searchedKeyword, setSearchedKeyword] = useState("");

  const [page, setPage] = useState(1);

  const [searchResult, setSearchResult] = useState(null);

  const [selectedPlace, setSelectedPlace] = useState(null);

  /*
   * 검색
   *
   * GET 요청이지만 사용자가 검색 버튼을 눌렀을 때
   * 명령형으로 실행하고 싶기 때문에
   * 이번 수업에서는 useMutation을 사용합니다.
   */
  const searchMutation = useMutation({
    mutationFn: searchKakaoPlaces,

    onSuccess: (data) => {
      setSearchResult(data);
      setSelectedPlace(null);
    },
  });

  /*
   * DB 등록
   */
  const importMutation = useMutation({
    mutationFn: importKakaoPlace,

    onSuccess: async (savedPlace) => {
      await queryClient.invalidateQueries({
        queryKey: ["places"],
      });

      navigate("/admin/places", {
        replace: true,
        state: {
          message: `"${savedPlace.name}" 장소가 등록되었습니다.`,
        },
      });
    },
  });

  const executeSearch = (query, targetPage) => {
    searchMutation.mutate({
      query,
      page: targetPage,
      size: 15,
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = keyword.trim();

    if (!query) {
      return;
    }

    setSearchedKeyword(query);
    setPage(1);

    executeSearch(query, 1);
  };

  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    const nextPage = page - 1;

    setPage(nextPage);

    executeSearch(searchedKeyword, nextPage);
  };

  const handleNextPage = () => {
    if (!searchResult || searchResult.end) {
      return;
    }

    const nextPage = page + 1;

    setPage(nextPage);

    executeSearch(searchedKeyword, nextPage);
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);

    importMutation.reset();
  };

  const handleImport = (placeData) => {
    importMutation.mutate(placeData);
  };

  const searchError = searchMutation.isError
    ? getApiErrorMessage(
        searchMutation.error,
        "카카오 장소 검색에 실패했습니다.",
      )
    : "";

  const importError = importMutation.isError
    ? getApiErrorMessage(importMutation.error, "관광 장소 등록에 실패했습니다.")
    : "";

  const places = searchResult?.places ?? [];

  return (
    <section>
      <AdminPageHeader
        title="카카오 장소 검색"
        description="카카오에서 관광 장소를 검색하고 우리 서비스에 등록합니다."
        buttonText="등록 장소 관리"
        buttonLink="/admin/places"
      />

      <SearchForm
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSubmit={handleSearch}
        isSearching={searchMutation.isPending}
      />

      {searchError && <ErrorMessage message={searchError} />}

      {!searchResult && !searchMutation.isPending && <EmptySearch />}

      {searchMutation.isPending && (
        <PageMessage message="카카오에서 장소를 검색하고 있습니다." />
      )}

      {searchResult && !searchMutation.isPending && (
        <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <SearchSummary
              keyword={searchedKeyword}
              totalCount={searchResult.totalCount}
              pageableCount={searchResult.pageableCount}
            />

            {places.length === 0 ? (
              <PageMessage message="검색 결과가 없습니다." />
            ) : (
              <div className="space-y-4">
                {places.map((place) => (
                  <KakaoPlaceCard
                    key={place.kakaoPlaceId}
                    place={place}
                    selected={
                      selectedPlace?.kakaoPlaceId === place.kakaoPlaceId
                    }
                    onSelect={handleSelectPlace}
                  />
                ))}
              </div>
            )}

            {places.length > 0 && (
              <Pagination
                page={page}
                isEnd={searchResult.end}
                isLoading={searchMutation.isPending}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
              />
            )}
          </div>

          <aside>
            <KakaoPlaceImportForm
              place={selectedPlace}
              isSaving={importMutation.isPending}
              error={importError}
              onSave={handleImport}
              onCancel={() => {
                setSelectedPlace(null);
                importMutation.reset();
              }}
            />
          </aside>
        </div>
      )}
    </section>
  );
}

function SearchForm({ keyword, onKeywordChange, onSubmit, isSearching }) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-7 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        카카오 장소 검색
      </label>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={19}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="예: 부산 해운대해수욕장"
            className="
              w-full rounded-xl
              border border-slate-300
              py-3 pl-11 pr-4
              outline-none transition
              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-100
            "
          />
        </div>

        <button
          type="submit"
          disabled={isSearching || !keyword.trim()}
          className="
            rounded-xl bg-violet-600
            px-6 py-3 font-semibold
            text-white transition
            hover:bg-violet-500
            disabled:cursor-not-allowed
            disabled:bg-slate-400
          "
        >
          {isSearching ? "검색 중..." : "검색"}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        부산 지역명까지 함께 검색하면 더 정확한 결과를 얻을 수 있습니다.
      </p>
    </form>
  );
}

function SearchSummary({ keyword, totalCount, pageableCount }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <strong className="text-slate-900">&quot;{keyword}&quot;</strong>

        <span className="ml-2 text-sm text-slate-500">
          검색 결과 {totalCount}건
        </span>
      </div>

      {totalCount !== pageableCount && (
        <span className="text-xs text-slate-400">
          조회 가능한 결과 {pageableCount}건
        </span>
      )}
    </div>
  );
}

function Pagination({ page, isEnd, isLoading, onPrevious, onNext }) {
  return (
    <div className="mt-7 flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={page <= 1 || isLoading}
        onClick={onPrevious}
        className="
          rounded-xl border
          border-slate-300
          px-5 py-2.5
          font-semibold
          text-slate-600
          hover:bg-slate-100
          disabled:opacity-40
        "
      >
        이전
      </button>

      <span className="text-sm font-semibold text-slate-600">
        {page} 페이지
      </span>

      <button
        type="button"
        disabled={isEnd || isLoading}
        onClick={onNext}
        className="
          rounded-xl border
          border-slate-300
          px-5 py-2.5
          font-semibold
          text-slate-600
          hover:bg-slate-100
          disabled:opacity-40
        "
      >
        다음
      </button>
    </div>
  );
}

function EmptySearch() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
      <SearchX size={42} className="mx-auto text-slate-300" />

      <h2 className="mt-4 font-bold text-slate-700">
        관광 장소를 검색해보세요.
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        예: 부산 광안리, 해운대해수욕장, 해동용궁사
      </p>
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

export default KakaoSearchPage;
