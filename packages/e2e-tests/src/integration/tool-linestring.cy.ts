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

import { MapTool, StyleProperties } from '@abc-map/shared';
import { TestHelper } from '../helpers/TestHelper';
import { ModeName, ToolSelector } from '../helpers/ToolSelector';
import { Draw } from '../helpers/Draw';
import { MainMap } from '../helpers/MainMap';
import { DefaultDrawingStyle } from '../helpers/DefaultDrawingStyle';
import { Routes } from '../helpers/Routes';
import { Project } from '../helpers/Project';

describe('Tool LineString', function () {
  beforeEach(() => {
    TestHelper.init();
  });

  it('user can draw', function () {
    cy.visit(Routes.map().format())
      .then(() => Project.newProject())
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.LineString))
      // First
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(100, 150))
      .then(() => Draw.dblclick(150, 100))
      // Second
      .then(() => Draw.click(300, 300))
      .then(() => Draw.click(350, 350))
      .then(() => Draw.click(300, 350))
      .then(() => Draw.dblclick(350, 300))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        const extents = features.map((f) => f.getGeometry()?.getExtent());

        expect(features[0].getGeometry()?.getType()).equal('LineString');
        expect(features[0].get(StyleProperties.StrokeWidth)).equal(DefaultDrawingStyle.stroke.width);
        expect(features[0].get(StyleProperties.StrokeColor)).equal(DefaultDrawingStyle.stroke.color);

        expect(features[1].getGeometry()?.getType()).equal('LineString');
        expect(features[1].get(StyleProperties.StrokeWidth)).equal(DefaultDrawingStyle.stroke.width);
        expect(features[1].get(StyleProperties.StrokeColor)).equal(DefaultDrawingStyle.stroke.color);

        expect(extents).deep.equals(
          [
            [-3564850.149620659, 3583374.765835424, -3075653.168595531, 4072571.746860552],
            [-1608062.225520147, 1626586.8417349122, -1118865.2444950193, 2115783.82276004],
          ],
          `Actual: "${JSON.stringify(extents)}"`
        );
      });
  });

  it('user can modify right after creation', function () {
    cy.visit(Routes.map().format())
      .then(() => Project.newProject())
      // Create line
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.LineString))
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(100, 150))
      .then(() => Draw.dblclick(150, 100))
      // Modify it
      .then(() => Draw.drag(100, 100, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        const extents = features.map((f) => f.getGeometry()?.getExtent());

        expect(features[0].getGeometry()?.getType()).equal('LineString');
        expect(extents).deep.equals([[-3564850.149620659, -819398.0633907281, 1327119.660630621, 4072571.746860552]], `Actual: "${JSON.stringify(extents)}"`);
      });
  });

  it('user can modify later', function () {
    cy.visit(Routes.map().format())
      .then(() => Project.newProject())
      // Create line
      .then(() => MainMap.fixedView1())
      .then(() => ToolSelector.enable(MapTool.LineString))
      .then(() => Draw.click(100, 100))
      .then(() => Draw.click(150, 150))
      .then(() => Draw.click(100, 150))
      .then(() => Draw.dblclick(150, 100))
      // Unselect all
      .get('[data-cy=unselect-all]')
      .click()
      // Select shape
      .then(() => ToolSelector.toolMode(ModeName.Modify))
      .then(() => Draw.click(100, 100))
      // Modify it
      .then(() => Draw.drag(100, 100, 600, 600))
      .then(() => MainMap.getReference())
      .should((map) => {
        const features = map.getActiveLayerFeatures();
        const extents = features.map((f) => f.getGeometry()?.getExtent());

        expect(features[0].getGeometry()?.getType()).equal('LineString');
        expect(extents).deep.equals([[-3564850.149620659, -819398.0633907281, 1327119.660630621, 4072571.746860552]], `Actual: "${JSON.stringify(extents)}"`);
      });
  });
});
