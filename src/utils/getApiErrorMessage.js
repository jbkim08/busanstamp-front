export function getApiErrorMessage(
  error,
  defaultMessage = "요청 처리에 실패했습니다.",
) {
  return error.response?.data?.message ?? error.message ?? defaultMessage;
}
