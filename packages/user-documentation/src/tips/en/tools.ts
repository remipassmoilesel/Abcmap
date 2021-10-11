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

import { Tip } from '../Tip';
import { ToolTips } from '../tip-ids';

const undoRedoTip = `
<li><b>To cancel</b> hold <code>CTRL</code> and press <code>Z</code></li>
<li><b>To redo</b> hold <code>CTRL</code> and <code>SHIFT</code>, and press <code>Z</code></li>
`;

export const Tools: Tip[] = [
  {
    id: ToolTips.Point,
    content: `<h4>Point tool</h4>
              <ul>
                <li><b>To create a point</b>, click on the map</li>
                <li><b>To select a point</b>, hold <code>CTRL</code> and click on the point</li>
                <li><b>To modify a point</b>, select it, you can then move it with your mouse, or modify its characteristics</li>
                <li><b>To delete a point</b>, select it and press <code>DELETE</code></li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.LineString,
    content: `<h4>Line tool</h4>
              <ul>
                <li><b>To create a line</b>, click on the map several times, then double-click
                 to end the line. You can interrupt a drawing by pressing <code>ESCAPE</code></li>
                <li><b>To select a line</b>, hold <code>CTRL</code> and click on the line</li>
                <li><b>To modify a line</b>, select it, you can then create vertices,
                 move vertices, or modify its characteristics</li>
                <li><b>To delete a line</b>, select it and press <code>DELETE</code></li>
                <li><b>To delete a vertex</b>, select the line, hold <code>ALT</code> and click on the vertex</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Polygon,
    content: `<h4>Polygon tool</h4>
              <ul>
                <li><b>To create a polygon</b>, click on the map several times, then double-click
                 to complete the polygon. You can interrupt a drawing by pressing <code>ESCAPE</code></li>
                <li><b>To select a polygon</b>, hold <code>CTRL</code> and click on the polygon</li>
                <li><b>To modify a polygon</b>, select it, you can then with your mouse create vertices,
                 move vertices, or modify its characteristics</li>
                <li><b>To delete a polygon</b>, select it and press <code>DELETE</code></li>
                <li><b>To delete a vertex</b>, select the polygon, hold <code>ALT</code> and click on
                 the summit</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Text,
    content: `<h4>Text tool</h4>
              <ul>
                <li><b>To add text</b>, hold <code>CTRL</code> and click on a geometry. An input control
                appears, enter your text then click on <code>OK</code></li>
                <li><b>To edit text</b>, hold <code>CTRL</code> and click on a geometry</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Selection,
    content: `<h4>Selection tool</h4>
              <ul>
                <li><b>To select geometries</b>, hold <code>CTRL</code>, draw a rectangle on the map then release</li>
                <li><b>To modify the characteristics of several geometries</b>, select them then use the options panel of
                 the selection tool</li>
                <li><b>To delete geometries</b>, select them and press <code>DELETE</code></li>
                <li><b>To duplicate geometries</b>, select them and press the <code>Duplicate</code> button
                 from the Selection panel</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.EditProperties,
    content: `<h4>Property editing tool</h4>
              <ul>
                 <li><b>To edit the properties</b> of a geometry, hold <code>CTRL</code> and click on a geometry</li>
                 ${undoRedoTip}
              </ul>
              `,
  },
];
