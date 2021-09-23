/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

// TODO: better typings
export interface WmtsCapabilities {
  version?: string;
  ServiceIdentification?: ServiceIdentification;
  ServiceProvider?: ServiceProvider;
  OperationsMetadata?: any;
  Contents?: Contents;
}

export interface ServiceIdentification {
  Title?: string;
  Abstract?: string;
  ServiceType?: string;
  ServiceTypeVersion?: string;
  Fees?: string;
  AccessConstraints?: string;
}

export interface ServiceProvider {
  ProviderName?: string;
  ProviderSite?: string;
  ServiceContact?: any;
}

export interface Contents {
  Layer?: WmtsLayer[];
  TileMatrixSet?: TileMatrixSet;
}

export interface WmtsLayer {
  Title?: string;
  Abstract?: string;
  WGS84BoundingBox?: [number, number, number, number];
  Identifier?: string;
  Style?: any[];
  Format?: string[];
  TileMatrixSetLink?: TileMatrixSetLink[];
}

export interface TileMatrixSetLink {
  TileMatrixSet?: string;
  TileMatrixSetLimits?: {
    TileMatrix?: string;
    MinTileRow?: number;
    MaxTileRow?: number;
    MinTileCol?: number;
    MaxTileCol?: number;
  }[];
}

export interface TileMatrixSet {
  Identifier?: string;
  SupportedCRS?: string;
  TileMatrix?: {
    Identifier?: string;
    ScaleDenominator?: number;
    TopLeftCorner?: [number, number];
    TileWidth?: number;
    TileHeight?: number;
    MatrixWidth?: number;
    MatrixHeight?: number;
  }[];
}
