(() => {
  'use strict';
  const token = localStorage.getItem('token');
  if (!token) {
    localStorage.clear();
    changeView('');
  }
})();

const incidencesDB = new PouchDB('incidences');

const acceptIncidence = async (id) => {
  try {
    const response = await axiosClient.post('/incidences/status', {
      id,
      status: { id: 4 },
    });
    console.log(response);
    if (response['changed']) {
      toastMessage('Cambio de estado realizado correctamente').showToast();
      getAllIncidencesPending();
    }
  } catch (error) {
    console.log(error);
    toastMessage('Error al aceptar la incidencia').showToast();
  }
};

const rejectIncidence = async (id) => {
  try {
    const response = await axiosClient.post('/incidences/status', {
      id,
      status: { id: 6 },
    });
    console.log(response);
    if (response['changed']) {
      toastMessage('Cambio de estado realizado correctamente').showToast();
      getAllIncidencesPending();
    }
  } catch (error) {
    console.log(error);
    toastMessage('Error al rechazar la incidencia').showToast();
  }
};

const getAllIncidencesPending = async () => {
  try {
    const table = $('#incidencesTable').DataTable();
    table.destroy();
    const user = parseJWT();
    const response = await axiosClient.get(`/incidences/pending/${user.id}`);
    console.log(response);
    const incidences = document.getElementById('pendingIncidences');
    let content = ``;
    incidences.innerHTML = ``;
    const { rows } = await incidencesDB.allDocs({ include_docs: true });
    for (const [i, incidence] of response?.incidences.entries()) {
      const date = new Date(incidence.incidenceDate);
      const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month (months are zero-based)
      const year = date.getFullYear();
      content += `
      <tr>
        <th scope="row">${i + 1}</th>
        <td>${
          incidence.person.name +
          ' ' +
          incidence.person.surname +
          ' ' +
          (incidence.person.lastname ?? '')
        }</td>
        <td>${incidence.user.area.name}</td>
        <td>${day}-${month}-${year}</td>
        <td>
        ${
          rows?.find((row) => row?.doc?.id === incidence.id)
            ? `<button type="button" class="btn btn-success btn-sm" disabled>ACEPTAR</button>
            <button type="button" class="btn btn-danger btn-sm" disabled>RECHAZAR</button>`
            : `<button type="button" class="btn btn-success btn-sm" onclick="acceptIncidence(${incidence.id})">ACEPTAR</button>
            <button type="button" class="btn btn-danger btn-sm" onclick="rejectIncidence(${incidence.id})">RECHAZAR</button>`
        }
        </td>
      </tr>
      `;
    }
    incidences.innerHTML = content;
    new DataTable($('#incidencesTable'), {
      columnDefs: [{ orderable: false, targets: 4 }],
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
      },
    });
  } catch (error) {
    console.log(error);
  }
};

$(document).ready(function () {
  if (!fullname) fullname = localStorage.getItem('fullname');
  if (!role) role = localStorage.getItem('activeRole');
  $('#fullname').text(fullname);
  $('#fullname2').text(fullname);
  $('#role').text(role);
  getAllIncidencesPending();
});