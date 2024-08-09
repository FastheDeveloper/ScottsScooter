const BASE_URL = 'https://api.mapbox.com';

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
  distance: number;
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

interface Tracepoint {
  alternatives_count: number;
  waypoint_index: number;
  matchings_index: number;
  distance: number;
  name: string;
  location: [number, number];
}
interface Geo {
  coordinates: number[][];
  type: string;
}

interface Matching {
  confidence: number;
  geometry: Geo; // Replace `any` with the actual type if known
  legs: any[]; // Replace `any` with the actual type if known
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
}

interface FetchDirectionResponse {
  code: string;
  matchings: Matching[];
  tracepoints: Tracepoint[];
}

export async function getDirections(from: Details[], to: Details[]) {
  try {
    console.log('starteing');

    const response = await fetch(
      `${BASE_URL}/directions/v5/mapbox/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${process.env.EXPO_PUBLIC_MAPBOX_PK}`
    );
    console.log('response');

    const json = await response.json();
    // console.log(JSON.stringify(json, null, 3));
    return json;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchDirectionBasedOnCoords(
  coordinates: number[][],
  profile: string = 'cycling'
) {
  const coordinatesString = coordinates.map((coord) => `${coord[0]},${coord[1]}`).join(';');
  console.log(coordinatesString, 'Stringifued');
  const response = await fetch(
    `${BASE_URL}/matching/v5/mapbox/${profile}/${coordinatesString}?annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=${process.env.EXPO_PUBLIC_MAPBOX_PK}`
  );
  const json: FetchDirectionResponse = await response.json();
  console.log('ACtual');
  return json;
}
