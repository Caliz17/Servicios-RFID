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

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/payService" element={<PayServiceForm />} />
          <Route path="/cardRfid" element={<RfidCardForm />} />
          <Route path="/services" element={<Services />} />
          <Route path='/typeAccount' element={<TypeAccount />} />
          <Route path='/customer' element={<Clients />} />
          <Route path='/roles' element={<UserRoles />} />
          <Route path='/users' element={<Users />} />
          <Route path='/account' element={<AccountForm />} />
          <Route path='/transfer' element={<TransferForm />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;