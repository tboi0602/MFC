import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Map = ({
  mfcs,
  route,
  selectedShipper,
  selectedLocation,
  onLocationSelect,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routingSMRef = useRef(null);
  const routingMCRef = useRef(null);

  const [address, setAddress] = useState("");

  const handleSearch = async () => {
    if (!address) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        if (onLocationSelect) onLocationSelect(latNum, lonNum);
        mapInstanceRef.current.setView([latNum, lonNum], 14);
      } else {
        alert("Không tìm thấy địa chỉ!");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      alert("Có lỗi xảy ra khi tìm địa chỉ!");
    }
  };

  const handleMapClick = (e) => {
    if (onLocationSelect) onLocationSelect(e.latlng.lat, e.latlng.lng);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([10.7769, 106.7009], 12);
    L.control.zoom({ position: "topright" }).addTo(mapInstanceRef.current);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.on("click", handleMapClick);

    return () => {
      if (mapInstanceRef.current) mapInstanceRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (routingSMRef.current)
      mapInstanceRef.current.removeControl(routingSMRef.current);
    routingSMRef.current = null;
    if (routingMCRef.current)
      mapInstanceRef.current.removeControl(routingMCRef.current);
    routingMCRef.current = null;

    // --- MFC & Shippers ---
    mfcs.forEach((mfc) => {
      const availableShippers = mfc.shippers.filter(
        (s) => s.isAvailable
      ).length;

      const mfcIcon = L.divIcon({
        html: `<div class="relative">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-white shadow flex items-center justify-center text-sm md:text-base">🏢</div>
          <div class="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold border border-white">
            ${availableShippers}
          </div>
        </div>`,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const mfcMarker = L.marker([mfc.lat, mfc.lng], { icon: mfcIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `<strong>${mfc.name}</strong><br/>Shippers: ${availableShippers}`
        );
      markersRef.current.push(mfcMarker);

      mfc.shippers.forEach((shipper) => {
        if (!shipper.isAvailable) return;
        const isSelected = selectedShipper?.id === shipper.id;

        const shipperIcon = L.divIcon({
          html: `<div class="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-xl border shadow ${
            isSelected
              ? "bg-green-500 border-green-700 text-white"
              : "bg-gradient-to-r from-orange-500 to-orange-600 border-white"
          } text-[10px] md:text-xs">${isSelected ? "🚚✔" : "🚚"}</div>`,
          className: "custom-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const shipperMarker = L.marker([shipper.lat, shipper.lng], {
          icon: shipperIcon,
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `<strong>${shipper.name}</strong><br/>Rating: ${shipper.rating}/5${
              isSelected ? "<br/>Được chọn" : ""
            }`
          );
        markersRef.current.push(shipperMarker);
      });
    });

    // --- Marker khách hàng ---
    if (selectedLocation) {
      const customerIcon = L.divIcon({
        html: `<div class="bg-gradient-to-r from-red-500 to-red-600 w-10 h-10 md:w-12 md:h-12 rounded-xl border border-white shadow flex items-center justify-center text-sm md:text-base">🏠</div>`,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const customerMarker = L.marker(
        [selectedLocation.lat, selectedLocation.lng],
        { icon: customerIcon }
      )
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `<strong>Khách hàng</strong><br/>Lat: ${selectedLocation.lat}<br/>Lng: ${selectedLocation.lng}`
        );
      markersRef.current.push(customerMarker);
    }

    // --- Routing ---
    if (route && route.length === 3) {
      const [shipper, mfc, customer] = route;
      const trafficColors = {
        clear: "#10B981",
        medium: "#F59E0B",
        heavy: "#EF4444",
      };
      const randomStatus = () =>
        ["clear", "medium", "heavy"][Math.floor(Math.random() * 3)];
      const statusSM = randomStatus();
      const statusMC = randomStatus();

      routingSMRef.current = L.Routing.control({
        waypoints: [L.latLng(shipper[0], shipper[1]), L.latLng(mfc[0], mfc[1])],
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        show: false,
        lineOptions: {
          styles: [{ color: trafficColors[statusSM], weight: 6 }],
        },
        createMarker: () => null,
      }).addTo(mapInstanceRef.current);

      routingMCRef.current = L.Routing.control({
        waypoints: [
          L.latLng(mfc[0], mfc[1]),
          L.latLng(customer[0], customer[1]),
        ],
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        show: false,
        lineOptions: {
          styles: [{ color: trafficColors[statusMC], weight: 6 }],
        },
        createMarker: () => null,
      }).addTo(mapInstanceRef.current);
    }
  }, [mfcs, selectedShipper, selectedLocation, route]);

  return (
    <div className="flex flex-col h-[80vh] md:h-[70vh] lg:h-[80vh] w-full">
      {/* Ô nhập địa chỉ */}
      <div className="p-2 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Nhập địa chỉ khách hàng/thành phố..."
          className="border p-2 rounded w-full sm:w-80"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Tìm
        </button>
      </div>

      <div
        ref={mapRef}
        className="flex-1 w-full rounded-xl shadow-inner mt-2 z-20"
      />
    </div>
  );
};

export default Map;
