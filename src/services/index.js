import axios from "axios";

export const getStations = async (filteredNetworks, setStations, stations) => {
  console.log("entrou");
  const newStations = [];
  new Promise((resolve) => {
    filteredNetworks.map((f, idx) => {
      axios
        .get(`https://api.citybik.es${f.href}`)
        .then((res) => {
          newStations.push(res.data.network);
          console.log("dentro-map");
          if (newStations.length === filteredNetworks.length) {
            console.log("acabou");
            resolve();
          }
        })
        .catch((error) => console.log("dentro", error));
    });
  })
    .then((res) => {
      console.log("sair");
      setStations(newStations);
    })
    .catch((error) => console.log("fora", error));
};

export const getNetworks = async (setCountries) => {
  await axios
    .get("http://api.citybik.es/v2/networks?fields=id,location,href")
    .then((res) => {
      const networks = res.data.networks;
      const countryList = [];
      networks.forEach((net) => {
        const idx = countryList.findIndex(
          (l) => l.country === net.location.country
        );
        if (idx === -1) {
          return countryList.push({
            country: net.location.country,
            networks: [net],
          });
        }
        countryList[idx].networks.push(net);
      });
      setCountries(countryList);
    })
    .catch((err) => {
      console.log("NE", err);
    });
};
