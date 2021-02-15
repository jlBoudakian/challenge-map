/*
  File: App.js
  Description: Main page with map
*/
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  LayerGroup,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "./App.css";
import { getNetworks, getStations } from "./services";

const App = () => {
  // Information to render on the screen
  const [countries, setCountries] = useState([]);
  const [networks, setNetworks] = useState([]);

  // Map properties
  const [mapCenter, setMapCenter] = useState([50, 10]);
  const [mapZoom, setMapZoom] = useState(4);

  // States to control user interaction
  const [showNetworks, setShowNetworks] = useState(false);
  const [showStations, setShowStations] = useState(false);
  const [selectedNet, setSelectedNet] = useState(null);

  // Custom Icons for better identification on the map
  var greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var goldIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  /*
    Function: handleNetworks
    Input: Index of the selected country
    Output: State set with an array of networks and its respective stations
  */
  const handleNetworks = async (idx) => {
    // Reset markers on the map
    setShowNetworks(false);
    setShowStations(false);
    setSelectedNet(null);

    // Getting networks and stations for the selected country
    const filteredNetworks = countries[idx].networks;
    await getStations(filteredNetworks, setNetworks, networks);
  };

  useEffect(() => {
    // Initial method to get all the information on the countries/networks
    getNetworks(setCountries);
  }, []);

  useEffect(() => {
    if (networks.length > 0) {
      // Show networks after they are loaded
      setShowNetworks(true);
    }
  }, [networks]);

  return (
    <div className="App container">
      <nav class="navbar navbar-light bg-light col-12">
        <span class="navbar-brand mb-0 h1">Map Challenge - Field Tryout</span>
      </nav>
      <div className="row">
        <div className="col-8">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            maxZoom={20}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
            animate={true}
            easeLinearity={0.35}
          >
            <LayersControl position="topright">
              <TileLayer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                attribution={"Field-Tryout"}
              />
              <LayersControl.Overlay checked name="Networks per country">
                <LayerGroup>
                  {countries.length > 0 &&
                    countries.map((c, idx) => (
                      <Marker
                        position={[
                          c.networks[0].location.latitude,
                          c.networks[0].location.longitude,
                        ]}
                        eventHandlers={{
                          click: () => {
                            handleNetworks(idx);
                          },
                        }}
                      >
                        <Tooltip>
                          Country:{c.country} <br />
                          {c.networks.length} networks
                        </Tooltip>
                      </Marker>
                    ))}
                </LayerGroup>
              </LayersControl.Overlay>
              {showNetworks && (
                <LayerGroup>
                  {networks.length > 0 &&
                    networks.map((n, idx) => (
                      <Marker
                        position={[n.location.latitude, n.location.longitude]}
                        icon={greenIcon}
                        eventHandlers={{
                          click: () => {
                            setShowNetworks(false);
                            setShowStations(true);
                            setSelectedNet(n);
                          },
                        }}
                      >
                        <Tooltip>
                          Country: {n.location.country} <br />
                          Network:{n.name} <br />
                          {n.stations.length} stations
                        </Tooltip>
                      </Marker>
                    ))}
                </LayerGroup>
              )}
              {showStations && (
                <LayerGroup>
                  {selectedNet &&
                    selectedNet.stations.length > 0 &&
                    selectedNet.stations.map((s, idx) => (
                      <Marker
                        position={[s.latitude, s.longitude]}
                        icon={goldIcon}
                        eventHandlers={{
                          click: () => {
                            setShowNetworks(true);
                            setShowStations(false);
                            setSelectedNet(null);
                          },
                        }}
                      >
                        <Tooltip>
                          Country: {selectedNet.location.country} <br />
                          Network: {selectedNet.name} <br />
                          Station: {s.name} <br />
                          {s.extra.address
                            ? `Address: ${s.extra.address}`
                            : ""}{" "}
                          <br />
                          -Free bikes: {s.free_bikes} <br />
                          -Empty slots: {s.empty_slots} <br />
                        </Tooltip>
                      </Marker>
                    ))}
                </LayerGroup>
              )}
            </LayersControl>
          </MapContainer>
        </div>
        <div className="col-3">
          <div class="card text-white bg-primary mb-3">
            <div class="card-header">Countries</div>
          </div>
          <div class="card text-white bg-success mb-3">
            <div class="card-header">Networks</div>
          </div>
          <div class="card text-white bg-warning mb-3">
            <div class="card-header">Stations</div>
          </div>
          <div class="card">
            <div class="card-header">Guide:</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">1 - Select Country</li>
              <li class="list-group-item">2 - Select Network</li>
              <li class="list-group-item">
                3 - Stations Details on the tooltip
              </li>
            </ul>
            <div class="card-footer">
              Obs: Click on station to go back to networks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
