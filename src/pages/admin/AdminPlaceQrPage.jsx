import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Download, Printer, QrCode } from "lucide-react";

import { Link, useParams } from "react-router";

import { getPlace } from "../../api/placeApi";

import { getPlaceQr } from "../../api/qrApi";

function AdminPlaceQrPage() {
  //주소변수 placeId 가져오기
  const { placeId } = useParams();
  //QR이미지주소
  const [qrImageUrl, setQrImageUrl] = useState(null);

  const { data: place } = useQuery({
    queryKey: ["places", placeId],

    queryFn: () => getPlace(placeId),
  });

  const {
    data: qrBlob,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["places", placeId, "qr"],

    queryFn: () => getPlaceQr(placeId),
  });

  useEffect(() => {
    if (!qrBlob) {
      return;
    }
    //백엔드에서 받은 이미지를 메모리에 저장한 주소
    const url = URL.createObjectURL(qrBlob);

    setQrImageUrl(url);

    return () => {
      URL.revokeObjectURL(url); //필요없으면 해제함
    };
  }, [qrBlob]);

  if (isPending) {
    return <p>QR 코드를 생성하고 있습니다.</p>;
  }

  if (isError) {
    return <p>QR 코드를 생성하지 못했습니다.</p>;
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <QrCode />
        </div>

        <h1 className="mt-4 text-2xl font-bold">{place?.name}</h1>

        <p className="mt-2 text-slate-500">관광지 체크인 QR 코드</p>

        {qrImageUrl && (
          <div className="mt-7">
            <img
              src={qrImageUrl}
              alt={`${place?.name} QR 코드`}
              className="mx-auto size-80"
            />
          </div>
        )}

        <p className="mt-6 text-sm text-slate-500">
          관광객이 휴대폰 기본 카메라로 QR 코드를 촬영하면 체크인 페이지로
          이동합니다.
        </p>

        <div className="mt-7 flex justify-center gap-3">
          {qrImageUrl && (
            <a
              href={qrImageUrl}
              download={`${place?.name ?? "place"}-qr.png`}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white"
            >
              <Download size={18} />
              QR 저장
            </a>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600"
          >
            <Printer size={18} />
            인쇄
          </button>
        </div>

        <Link
          to="/admin/places"
          className="mt-7 inline-block text-sm font-semibold text-blue-600"
        >
          장소 관리로 돌아가기
        </Link>
      </div>
    </section>
  );
}

export default AdminPlaceQrPage;
