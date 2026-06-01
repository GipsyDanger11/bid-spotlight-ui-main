import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Customer from "./pages/Customer";
import Seller from "./pages/Seller";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ManageUsers from "./pages/ManageUsers";
import ManageAuctions from "./pages/ManageAuctions";
import ViewReports from "./pages/ViewReports";
import PastAuctions from "./pages/PastAuctions";
import NewListing from "./pages/NewListing";
import TestCustomer from "./pages/TestCustomer";
import ContactUs from "./pages/ContactUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/seller/new-listing" element={<NewListing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-auctions" element={<ManageAuctions />} />
          <Route path="/admin/view-reports" element={<ViewReports />} />
          <Route path="/admin/past-auctions" element={<PastAuctions />} />
          <Route path="/test-customer" element={<TestCustomer />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
