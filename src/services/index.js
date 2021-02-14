/*
  File: services/index.js
  Description: Functions that connect with the API
*/
import axios from "axios";

/*
  Function: getNetworks
  Input: Functions to set countries state
  Output: State set with an array of countries and its respective networks
*/
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
      console.log("Error - Networks", err);
    });
};

/*
  Function: getStations
  Input: Array of networks from the selected country and functions to set networks state
  Output: State set with an array of networks and its respective stations
*/
export const getStations = async (filteredNetworks, setNetworks) => {
  const newStations = [];
  new Promise((resolve) => {
    filteredNetworks.map((f, idx) => {
      axios
        .get(`https://api.citybik.es${f.href}`)
        .then((res) => {
          newStations.push(res.data.network);
          if (newStations.length === filteredNetworks.length) {
            resolve();
          }
        })
        .catch((error) => console.log("Error - Stations", error));
    });
  }).then((res) => {
    setNetworks(newStations);
  });
};
