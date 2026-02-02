// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { mockAssets } from '@/data/mockAssets';
// import L from 'leaflet';

// const getMarkerColor = (priority: string) => {
//   if (priority === 'P1') return 'red';
//   if (priority === 'P2') return 'orange';
//   return 'green';
// };

// const createIcon = (color: string) =>
//   new L.Icon({
//     iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
//     shadowUrl:
//       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//   });

// export default function CityMap() {
//   return (
//     <MapContainer
//       center={[28.6139, 77.2090]}
//       zoom={13}
//       className="h-[500px] w-full rounded-xl"
//     >
//       <TileLayer
//         attribution="© OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {mockAssets.map((asset) => (
//         <Marker
//           key={asset.id}
//           position={[asset.lat, asset.lng]}
//           icon={createIcon(getMarkerColor(asset.priority))}
//         >
//           <Popup>
//             <div className="space-y-1">
//               <h3 className="font-semibold">{asset.name}</h3>
//               <p>Type: {asset.type}</p>
//               <p>Priority: {asset.priority}</p>
//               <p>Risk Score: {asset.riskScore}</p>
//             </div>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import your mock data
import { mockAssets } from '@/data/mockAssets';

const getMarkerColor = (priority: string) => {
  if (priority === 'P1') return 'red';
  if (priority === 'P2') return 'orange';
  return 'green';
};

const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

export default function CityMap() {
  return (
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={13}
      className="h-[500px] w-full rounded-xl z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {mockAssets.map((asset) => (
        <Marker
          key={asset.id}
          position={[asset.lat, asset.lng]}
          icon={createIcon(getMarkerColor(asset.priority))}
        >
          <Popup>
            <div className="space-y-1">
              <h3 className="font-semibold">{asset.name}</h3>
              <p className="text-sm">Type: {asset.type}</p>
              <p className="text-sm">Priority: {asset.priority}</p>
              <p className="text-sm">Risk Score: {asset.riskScore}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}