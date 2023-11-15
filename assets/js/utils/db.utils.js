//POST -> Gestiones de datos, registro o actualización pasen por aqui

const incidencesDB = new PouchDB("incidences");

const saveIncidence = (incidence) => {
  incidence._id = new Date().toISOString();
  return incidencesDB
    .put(incidence)
    .then((result) => {
      self.registration.sync.register("incidence-post");
      const response = {
        registered: true,
        offline: true,
      };
      return new Response(JSON.stringify(response));
    })
    .catch((err) => {
      console.log(err);
      const response = {
        registered: false,
        offline: true,
      };
      return new Response(JSON.stringify(response));
    });
};

const saveIncidenceToApi = () => {
  const incidences = [];
  return incidencesDB.allDocs({ include_docs: true }).then((docs) => {
    const { rows } = docs;
    rows.forEach(async (row) => {
      const { doc } = row;
      try {
        //axios -> axios({url: 'fullurl', method:'', data{}})
        const response = await axiosClient.post("/incidences/save", doc);
        if (response["registered"]) {
          incidences.push(response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        return incidencesDB.remove(doc);
      }
    });
    const message = self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: "RELOAD_PAGE_AFTER_SYNC" });
      });
    });
    return Promise.all(...incidences, message);
  });
};
