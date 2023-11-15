(() => {
  'use strict';
  const token = localStorage.getItem('token');
  if (token) {
    changeView(localStorage.getItem('activeRole'));
  }
})();

const form = document.getElementById('signinForm');
const submitSigninForm = async (event) => {
  console.log("Entro aqui");
  event.stopPropagation();
  event.preventDefault();
  if (form.checkValidity()) {
    const username = document.getElementById('yourUsername').value;
    const password = document.getElementById('yourPassword').value;
    try {
      const response = await axiosClient.post(`/auth/signin`, {
        username,
        password,
      });
      console.log(response);
      const payload = JSON.parse(atob(response.token.split('.')[1]));
      console.log(payload);
      if (response?.token) {
        fullname = `${payload.person.name} ${payload.person.surname}${
          payload.person.lastname ? ` ${payload.person.lastname}` : ''
        }`;
        localStorage.setItem('token', response.token);
        localStorage.setItem('activeRole', payload.roles[0].role);
        localStorage.setItem('fullname', fullname);
        toastMessage(`Bienvenido ${username}`).showToast();
        changeView(payload.roles[0].role);
      }
    } catch (error) {
      console.log(error);
      toastMessage('Credenciales incorrectas').showToast();
    }
  }
};

form.addEventListener('submit', submitSigninForm);
