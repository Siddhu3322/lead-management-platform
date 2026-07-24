import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Leads from "./pages/Leads";
import LeadForm from "./pages/LeadForm";
import LeadDetails from "./pages/LeadDetails";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/leads"
            element={<Leads />}
          />

          <Route
            path="/leads/new"
            element={<LeadForm />}
          />

          <Route
            path="/leads/:id/edit"
            element={<LeadForm />}
          />

          <Route
            path="/leads/:id"
            element={<LeadDetails />}
          />
        </Route>

        <Route
          path="/"
          element={
            <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="*"
          element={
            <Navigate to="/dashboard" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;