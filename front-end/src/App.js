import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './layouts/Navbar.js';
import Home from './Components/Home.js';
import Services from './Components/Services.js';
import TypeAccount from './Components/TypeAccount.js';
import Clients from './Components/Customer.js';
import UserRoles from './Components/RoleUser.js';
import Users from './Components/Users.js';
import AccountForm from './Components/Account.js';
import TransferForm from './Components/Transfer.js';
import PayServiceForm from './Components/Pagos.js';
import RfidCardForm from './Components/Rfid.js';
import AuditoriaTable from './Components/Auditoria.js';
import Login from './Components/Login.js';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/payService"
              element={
                <PrivateRoute>
                  <PayServiceForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/cardRfid"
              element={
                <PrivateRoute>
                  <RfidCardForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/services"
              element={
                <PrivateRoute>
                  <Services />
                </PrivateRoute>
              }
            />
            <Route
              path="/typeAccount"
              element={
                <PrivateRoute>
                  <TypeAccount />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer"
              element={
                <PrivateRoute>
                  <Clients />
                </PrivateRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <PrivateRoute>
                  <UserRoles />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <AccountForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/transfer"
              element={
                <PrivateRoute>
                  <TransferForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/actions"
              element={
                <PrivateRoute>
                  <AuditoriaTable />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
