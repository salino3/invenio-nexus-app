import { useLayoutEffect } from "react";
import AppRouter from "./router/app-router";
import { useProvider } from "./store/provider";

function App() {
  const theme = useProvider((state) => state.theme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <AppRouter />;
}

export default App;
