import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AppRoutes } from "./routes";

function App(): JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
