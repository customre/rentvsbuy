import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CalculatorPage from "./pages/CalculatorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () =>
<QueryClientProvider client={queryClient} data-id="9df8rsrkl" data-path="src/App.tsx">
    <TooltipProvider data-id="r25yzsg96" data-path="src/App.tsx">
      <Toaster data-id="qknxfkk4s" data-path="src/App.tsx" />
      <BrowserRouter data-id="3oo0eimx9" data-path="src/App.tsx">
        <Routes data-id="b8mb0xuim" data-path="src/App.tsx">
          <Route path="/" element={<CalculatorPage data-id="ghgko5ykt" data-path="src/App.tsx" />} data-id="sx52s8q2u" data-path="src/App.tsx" />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound data-id="d23ilyec6" data-path="src/App.tsx" />} data-id="fqm37brbw" data-path="src/App.tsx" />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;


export default App;