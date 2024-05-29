import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Alert = ({ type, message }) => {
  const showAlert = () => {
    MySwal.fire({
      icon: type,
      title: type === 'success' ? 'Éxito' : 'Error',
      text: message,
      confirmButtonText: 'Aceptar',
    });
  };

  React.useEffect(() => {
    showAlert();
  }, []);

  return null;
};

export default Alert;
