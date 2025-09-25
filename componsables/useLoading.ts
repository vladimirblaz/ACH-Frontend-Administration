export function useLoading() {
  const loadingState = useState<{ message: string; show: boolean; }>("loading", () => ({ message: "", show: false }));

  function showLoading(message: string): void {
    loadingState.value.message = message;
    loadingState.value.show = true;
  }

  function hideLoading(): void {
    loadingState.value.message = "";
    loadingState.value.show = false;
  }

  return {
    showLoading,
    hideLoading,
  }
}
