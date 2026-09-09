import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import ItemDetails from "./pages/ItemDetails";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import VerifyLogin from "./pages/VerifyLogin";
import Register from "./pages/Register";
import VerifyRegister from "./pages/VerifyRegister";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyForgotPassword from "./pages/VerifyForgotPassword";
import Profile from "./pages/Profile";
import Purchases from "./pages/Purchases";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/admin/Dashboard";
import AdminItems from "./pages/admin/Items";
import ItemForm from "./pages/admin/ItemForm";
import AdminUsers from "./pages/admin/Users";
import AdminPayments from "./pages/admin/Payments";

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items/:id" element={<ItemDetails />} />

            <Route path="/login" element={<Login />} />
            <Route path="/verify-login" element={<VerifyLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-register" element={<VerifyRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-forgot-password" element={<VerifyForgotPassword />} />

            <Route
              path="/checkout/:itemId"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute>
                  <Purchases />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <RoleRoute>
                  <Dashboard />
                </RoleRoute>
              }
            >
              <Route index element={<AdminItems />} />
              <Route path="items" element={<AdminItems />} />
              <Route path="items/new" element={<ItemForm />} />
              <Route path="items/:id/edit" element={<ItemForm />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="payments" element={<AdminPayments />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
