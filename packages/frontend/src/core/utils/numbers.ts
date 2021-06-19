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

export function isNumeric(str: string): boolean {
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}

/**
 * If passed argument "looks like" a number (001, 111, ...) it will be converted to.
 * @param str
 */
export function asNumberOrString(str: string): number | string {
  let value = str;

  // We normalize float separator
  if (value.indexOf(',')) {
    value = value.replace(',', '.');
  }

  if (isNumeric(value)) {
    return parseFloat(value);
  } else {
    return str;
  }
}

export function toPrecision(n: number, precision = 4): number {
  return Math.round(n * 10 ** precision) / 10 ** precision;
}
