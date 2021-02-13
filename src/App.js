import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  LayerGroup,
  LayersControl,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "./App.css";
import { getNetworks, getStations } from "./services";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState([50, 10]);
  const [mapZoom, setMapZoom] = useState(4);
  const [initialLayer, setInitialLayer] = useState(true);
  const [showStations, setShowStations] = useState(false);
  const [stations, setStations] = useState([]);

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

  const handleNetworks = async (idx) => {
    const filteredNetworks = countries[idx].networks;
    await getStations(filteredNetworks, setStations, stations);
  };

  useEffect(() => {
    getNetworks(setCountries);
  }, []);

  useEffect(() => {
    if (!initialLayer) {
      setMapCenter([50, 10]);
    }
  }, [initialLayer]);

  useEffect(() => {
    if (stations.length > 0) {
      console.log("show");
      setShowStations(true);
    }
  }, [stations]);

  return (
    <div className="App">
      <p>Map Challenge</p>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        maxZoom={10}
        // attributionControl={true}
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
            attribution={"JULIANA"}
          />
          <LayersControl.Overlay
            checked={initialLayer}
            name="Networks per country"
          >
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
          {showStations && (
            <LayerGroup>
              {stations.length > 0 &&
                stations.map((s, idx) => (
                  <Marker
                    position={[s.location.latitude, s.location.longitude]}
                    icon={greenIcon}
                  >
                    <Tooltip>
                      Country: {s.location.country} <br />
                      Network:{s.name} <br />
                      {s.stations.length} stations
                    </Tooltip>
                  </Marker>
                ))}
            </LayerGroup>
          )}
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default App;
