import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import ImageGeneration from "@/pages/ImageGeneration";
import ImageEditing from "@/pages/ImageEditing";
import VideoGeneration from "@/pages/VideoGeneration";
import FullBodyAnimation from "@/pages/FullBodyAnimation";
import VoiceGeneration from "@/pages/VoiceGeneration";
import LTXStudio from "@/pages/LTXStudio";
import Gallery from "@/pages/Gallery";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ImageGeneration />} />
            <Route path="/edit" element={<ImageEditing />} />
            <Route path="/video" element={<VideoGeneration />} />
            <Route path="/animate" element={<FullBodyAnimation />} />
            <Route path="/voice" element={<VoiceGeneration />} />
            <Route path="/studio" element={<LTXStudio />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
