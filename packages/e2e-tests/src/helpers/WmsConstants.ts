/**
 * Copyright © 2023 Rémi Pace.
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

export class WmsConstants {
  // We can't use localhost because app in Cypress cannot access it
  public static readonly AUTHENTICATED_URL = 'http://0.0.0.0:3010/wms/authenticated';

  public static readonly USERNAME = 'jean-bonno';
  public static readonly PASSWORD = 'azerty1234';

  // We can't use localhost because app in Cypress cannot access it
  public static readonly PUBLIC_URL = 'http://0.0.0.0:3010/wms/public';
}
