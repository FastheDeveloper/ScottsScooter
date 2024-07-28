const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox';

export type Details = number;
export interface Coordinates {
  from: Details[];
  to: Details[];
}
interface Geometry {
  coordinates: [];
  type: string;
}
export interface Route {
  distace: number;
  duration: number;
  geometry: Geometry;
  legs: [];
  weight: number;
  weight_name: string;
}
export interface Waypoints {
  distance: number;
  location: [];
  name: string;
}
export interface DirectionsApi {
  code: string;
  uuid: string;
  routes: Route[];
  waypoints: Waypoints[];
}
export async function getDirections(from: Details[], to: Details[]) {
  try {
    console.log('starteing');

    const response = await fetch(
      `${BASE_URL}/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${process.env.EXPO_PUBLIC_MAPBOX_PK}`
    );
    console.log('response');

    const json = await response.json();
    // console.log(JSON.stringify(json, null, 3));
    return json;
  } catch (err) {
    console.log(err);
  }
}

// export async function fetchDirectionBasedOnCoords(coordinates) {
//   const coordinatesString = coordinates.map((coord) => `${coord[0]},${coord[1]}`).join(';');
//   const response = await fetch(
//     `${BASE_URL}mapbox/cycling/${coordinatesString}?annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=${process.env.EXPO_PUBLIC_MAPBOX_KEY}`
//   );
//   const json = await response.json();
//   return json;
// }
