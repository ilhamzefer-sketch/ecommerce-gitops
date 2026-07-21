import { AppRoutes } from "./router";
import { ScrollToTop } from "../shared/navigation/ScrollToTop";

export function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
  );
}
