import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, QrCode, TriangleAlert } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { checkin } from "../api/checkinApi";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

function CheckinPage() {
  //url 쿼리 스트링 저장
  const [searchParams] = useSearchParams();
  //토큰 저장
  const token = searchParams.get("token");
  //벡엔드에 체크인 요청
  const checkinMutation = useMutation({
    mutationFn: () => checkin(token),
  });

  if (!token) {
    return <CheckinError message="QR 체크인 정보가 없습니다." />;
  }

  if (checkinMutation.isSuccess) {
    const result = checkinMutation.data;

    return (
      <section className="mx-auto max-w-md py-10">
        <div className="rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 size={64} className="mx-auto text-green-500" />

          <p className="mt-5 text-sm font-semibold text-green-600">
            스탬프 획득!
          </p>

          <h1 className="mt-2 text-2xl font-bold">{result.placeName}</h1>

          <p className="mt-3 text-slate-500">
            관광지 방문 체크인이 완료되었습니다.
          </p>

          <Link
            to="/map"
            className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            관광 지도로 돌아가기
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <QrCode size={32} />
        </div>

        <h1 className="mt-5 text-2xl font-bold">관광지 체크인</h1>

        <p className="mt-3 leading-6 text-slate-500">
          QR 코드가 확인되었습니다.
          <br />
          스탬프를 획득하시겠습니까?
        </p>

        {checkinMutation.isError && (
          <div
            role="alert"
            className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {getApiErrorMessage(
              checkinMutation.error,
              "체크인에 실패했습니다.",
            )}
          </div>
        )}

        <button
          type="button"
          disabled={checkinMutation.isPending}
          onClick={() => checkinMutation.mutate()}
          className="
            mt-7 w-full rounded-xl
            bg-blue-600 px-6 py-3
            font-semibold text-white
            hover:bg-blue-500
            disabled:bg-slate-400
          "
        >
          {checkinMutation.isPending ? "체크인 중..." : "스탬프 받기"}
        </button>
      </div>
    </section>
  );
}

function CheckinError({ message }) {
  return (
    <section className="mx-auto max-w-md py-10">
      <div className="rounded-3xl bg-red-50 p-8 text-center">
        <TriangleAlert size={48} className="mx-auto text-red-500" />

        <p className="mt-5 font-semibold text-red-700">{message}</p>
      </div>
    </section>
  );
}

export default CheckinPage;
