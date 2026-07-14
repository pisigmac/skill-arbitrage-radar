import { Routes, Route } from "react-router";
import { Layout } from "./components/layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OpportunityDetail from "./pages/OpportunityDetail";
import ExecutionBoard from "./pages/ExecutionBoard";
import IncomeTracker from "./pages/IncomeTracker";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunity/:id" element={<OpportunityDetail />} />
        <Route path="/board" element={<ExecutionBoard />} />
        <Route path="/income" element={<IncomeTracker />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
