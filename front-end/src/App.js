// En App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './layouts/Navbar.js';
import Home from './Components/Home.js'; 
import Services from './Components/Services.js';
import TypeAccount from './Components/TypeAccount.js';
import Clients from './Components/Customer.js';
import UserRoles from './Components/RoleUser.js';
import Users from './Components/Users.js';
import AccountForm from './Components/Account.js';
import Login from './Components/Login';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        {/* Mostrar el Navbar solo si hay un usuario autenticado */}
        {user && <Navbar />}
        <Routes>
          {/* Ruta predeterminada redirige al Home si hay un usuario autenticado */}
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Login setUser={setUser} />}
          />
          {/* Rutas protegidas */}
          {user && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/typeAccount" element={<TypeAccount />} />
              <Route path="/customer" element={<Clients />} />
              <Route path="/roles" element={<UserRoles />} />
              <Route path="/users" element={<Users />} />
              <Route path="/account" element={<AccountForm />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
