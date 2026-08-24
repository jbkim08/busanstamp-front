import { Link } from "react-router";

function AdminPageHeader({ title, description, buttonText, buttonLink }) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-violet-600">관리자</p>

        <h1 className="mt-1 text-3xl font-bold">{title}</h1>

        {description && <p className="mt-2 text-slate-500">{description}</p>}
      </div>

      {buttonText && buttonLink && (
        <div className="mb-6 flex justify-end gap-3">
          <Link
            to="/admin/kakao-search"
            className="
            rounded-xl bg-amber-400
            px-5 py-3 font-semibold
            text-slate-900
            transition hover:bg-amber-300
          "
          >
            카카오에서 장소 찾기
          </Link>

          <Link
            to="/admin/places/new"
            className="
            rounded-xl bg-violet-600
            px-5 py-3 font-semibold
            text-white
            hover:bg-violet-500
          "
          >
            직접 등록
          </Link>
        </div>
      )}
    </div>
  );
}

export default AdminPageHeader;
