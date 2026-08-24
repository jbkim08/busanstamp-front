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
        <Link
          to={buttonLink}
          className="
            rounded-xl bg-violet-600 px-5 py-3
            font-semibold text-white transition
            hover:bg-violet-500
          "
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}

export default AdminPageHeader;
