import React from 'react';
import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import { APP_COLOR } from '../constants/AppConstants';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

export default function LineRoute({
  coordinates,
  id = 'rideSource',
}: {
  coordinates: Position[];
  id?: string;
}) {
  return (
    <ShapeSource
      id={id}
      lineMetrics
      shape={{
        properties: {},
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      }}>
      <LineLayer
        id="exampleLineLayerBackground"
        style={{
          lineColor: APP_COLOR.MAIN_GREEN,
          lineCap: 'round',
          lineJoin: 'round',
          lineWidth: 5,
          lineOpacity: 0.4,
        }}
      />
      <LineLayer
        id="exampleLineLayer"
        style={{
          lineColor: APP_COLOR.MAIN_GREEN,
          lineCap: 'round',
          lineJoin: 'round',
          lineWidth: 5,
          lineDasharray: [0, 2, 1],
        }}
      />
    </ShapeSource>
  );
}
