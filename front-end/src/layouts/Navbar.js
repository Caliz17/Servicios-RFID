import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCogs, faUsers, faCartShopping, faUsersCog, faFileInvoice } from '@fortawesome/free-solid-svg-icons';


const Dropdown = ({ title, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Retardo de 200 ms
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-full font-medium flex items-center"
      >
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {title}
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-0 w-32 bg-gray-800 rounded-md shadow-lg">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:rounded-md hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-8" src="https://cdn.icon-icons.com/icons2/3058/PNG/512/cloud_hosting_cloud_services_cloud_data_network_cloud_sharing_icon_190633.png" alt="Logo" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Dropdown
                  title="Inicio"
                  icon={faHome}
                  items={[{ label: 'Dashboard', href: '/home' }]}
                />
                <Dropdown
                  title="Compra"
                  icon={faCartShopping}
                  items={[{ label: 'Acerca de', href: '/about' }]}
                />
                <Dropdown
                  title="Servicios"
                  icon={faCogs}
                  items={[{ label: 'Control de Servicios', href: '/services' }]}
                />
                <Dropdown
                  title="Cuentas"
                  icon={faFileInvoice}
                  items={[{ label: 'Control de Cuentas', href: '/account' }, {label: 'Transferencias', href: '/transfer'}, { label: 'Tipos de Cuenta', href: '/typeAccount' }]}
                />
                <Dropdown
                  title="Clientes"
                  icon={faUsers}
                  items={[{ label: 'Control de Clientes', href: '/customer' }]}
                />
                <Dropdown
                  title="Usuarios"
                  icon={faUsersCog}
                  items={[{ label: 'Control de Usuarios', href: '/users' }, { label: 'Roles de Usuario', href: '/roles' }]}  
                />
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Inicio</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Acerca de</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Servicios</a>
          <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contacto</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
