import { MapFactory } from './MapFactory';
import { AbcProperties } from '@abc-map/shared-entities';
import { MapTool } from '@abc-map/frontend-shared';
import { Map } from 'ol';
import { logger, MapWrapper } from './MapWrapper';
import { ToolRegistry } from '../tools/ToolRegistry';
import { OlTestHelper } from '../../utils/OlTestHelper';
import { CircleTool } from '../tools/circle/CircleTool';
import TileLayer from 'ol/layer/Tile';
import { LayerFactory } from '../layers/LayerFactory';
import VectorImageLayer from 'ol/layer/VectorImage';
import { NoneTool } from '../tools/none/NoneTool';
import { DragRotateAndZoom } from 'ol/interaction';

logger.disable();

describe('MapWrapper', function () {
  it('defaultLayers()', () => {
    const map = MapFactory.createNaked();
    map.addLayer(LayerFactory.newVectorLayer());

    map.defaultLayers();

    const layers = map.getLayers();
    expect(layers).toHaveLength(2);
    expect(layers[0].unwrap()).toBeInstanceOf(TileLayer);
    expect(layers[1].unwrap()).toBeInstanceOf(VectorImageLayer);
    expect(layers[0].isActive()).toBe(false);
    expect(layers[1].isActive()).toBe(true);
  });

  describe('setTarget(), dispose()', () => {
    it('setTarget() should set proper target and add resize observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});

      const map = new MapWrapper(olMap);
      map.addLayer(LayerFactory.newVectorLayer());
      map.setTarget(support);

      expect(olMap.getTarget()).toEqual(support);
      expect(map.getSizeObserver()).toBeDefined();
    });

    it('setTarget() should unset target and resize observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});

      const map = new MapWrapper(olMap);
      map.addLayer(LayerFactory.newVectorLayer());
      map.setTarget(support);
      map.setTarget(undefined);

      expect(olMap.getTarget()).toEqual(undefined);
      expect(map.getSizeObserver()).toBeUndefined();
    });

    it('dispose() should dispose map and size observer', () => {
      const support = document.createElement('div');
      const olMap = new Map({});
      olMap.dispose = jest.fn();

      const map = new MapWrapper(olMap);
      map.addLayer(LayerFactory.newVectorLayer());
      map.setTarget(support);

      expect(map.getSizeObserver()).toBeDefined();

      map.dispose();
      expect(olMap.dispose).toHaveBeenCalled();
      expect(map.getSizeObserver()).toBeUndefined();
    });
  });

  describe('Add layer', function () {
    it('should add layer', function () {
      const map = MapFactory.createNaked();
      map.addLayer(LayerFactory.newVectorLayer());

      expect(map.unwrap().getLayers().getLength()).toEqual(1);
      expect(map.unwrap().getLayers().getArray()[0]).toBeInstanceOf(VectorImageLayer);
    });
  });

  describe('setActiveLayer()', () => {
    it('on wrong layer', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newOsmLayer();

      expect(() => map.setActiveLayer(layer1)).toThrow(new Error('Layer does not belong to map'));
    });

    it('once', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newOsmLayer();
      const layer2 = LayerFactory.newVectorLayer();
      const layer3 = LayerFactory.newVectorLayer();
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);

      map.setActiveLayer(layer2);
      const layers = map.getLayers();
      expect(layers).toHaveLength(3);
      expect(map.unwrap().getLayers().get(AbcProperties.LastLayerChange)).toBeDefined();
      expect(layers[0].isActive()).toEqual(false);
      expect(layers[1].isActive()).toEqual(true);
      expect(layers[2].isActive()).toEqual(false);
    });

    it('twice', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newOsmLayer();
      const layer2 = LayerFactory.newVectorLayer();
      const layer3 = LayerFactory.newVectorLayer();
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);

      map.setActiveLayer(layer2);
      map.setActiveLayer(layer3);
      const layers = map.getLayers();
      expect(layers).toHaveLength(3);
      expect(map.unwrap().getLayers().get(AbcProperties.LastLayerChange)).toBeDefined();
      expect(layers[0].isActive()).toEqual(false);
      expect(layers[1].isActive()).toEqual(false);
      expect(layers[2].isActive()).toEqual(true);
    });
  });

  describe('getActiveLayer()', () => {
    it('should return undefined if no layer active', () => {
      const map = MapFactory.createNaked();

      expect(map.getActiveLayer()).toBeUndefined();
    });

    it('should return layer if one is active', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newOsmLayer();
      map.addLayer(layer1);
      map.setActiveLayer(layer1);

      expect(map.getActiveLayer()).toEqual(layer1);
    });
  });

  describe('getActiveVectorLayer()', () => {
    it('should return undefined if no layer active', () => {
      const map = MapFactory.createNaked();

      expect(map.getActiveVectorLayer()).toBeUndefined();
    });

    it('should return undefined if no vector layer active', () => {
      const map = MapFactory.createNaked();
      const layer = LayerFactory.newOsmLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      expect(map.getActiveVectorLayer()).toBeUndefined();
    });

    it('should return layer if one vector is active', () => {
      const map = MapFactory.createNaked();
      const layer1 = LayerFactory.newVectorLayer();
      map.addLayer(layer1);
      map.setActiveLayer(layer1);

      expect(map.getActiveVectorLayer()).toEqual(layer1);
    });
  });

  describe('Interaction handling', () => {
    it('setDefaultInteractions', () => {
      const map = MapFactory.createNaked();
      map.unwrap().addInteraction(new DragRotateAndZoom());

      map.setDefaultInteractions();

      expect(OlTestHelper.getInteractionNames(map.unwrap())).toEqual(['DragPan', 'MouseWheelZoom']);
    });

    it('set', () => {
      const map = MapFactory.createNaked();
      map.unwrap().addInteraction(new DragRotateAndZoom());

      map.cleanInteractions();

      expect(OlTestHelper.getInteractionNames(map.unwrap())).toEqual([]);
    });
  });

  // TODO: refactor test after tool refacto
  // TODO: refactor test after tool refacto
  // TODO: refactor test after tool refacto
  // TODO: refactor test after tool refacto
  describe('Tool handling', () => {
    it('Set tool should dispose previous tool', () => {
      const map = MapFactory.createNaked();
      const layer = LayerFactory.newVectorLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      const previous = ToolRegistry.getById(MapTool.Circle);
      const disposeMock = jest.fn();
      previous.dispose = disposeMock;

      map.setTool(previous);
      disposeMock.mockReset();

      const tool = ToolRegistry.getById(MapTool.Circle);
      map.setTool(tool);

      expect(disposeMock).toHaveBeenCalledTimes(1);
    });

    it('Set tool should setup tool', () => {
      const map = MapFactory.createNaked();
      const layer = LayerFactory.newVectorLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      const tool = ToolRegistry.getById(MapTool.Circle);
      tool.setup = jest.fn();
      map.setTool(tool);

      expect(tool.setup).toHaveBeenCalled();
      expect(map.getCurrentTool()).toStrictEqual(tool);
    });

    it('Set tool to Move should disable interaction', () => {
      const map = MapFactory.createNaked();
      const layer = LayerFactory.newVectorLayer();
      map.addLayer(layer);
      map.setActiveLayer(layer);

      map.setTool(ToolRegistry.getById(MapTool.Circle));
      map.setTool(ToolRegistry.getById(MapTool.None));

      expect(map.getCurrentTool()).toBeInstanceOf(NoneTool);
      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'Draw')).toEqual(0);
      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'Modify')).toEqual(0);
    });

    it('Set active layer should disable interaction (Vector -> Tile)', () => {
      const map = MapFactory.createNaked();
      const vector = LayerFactory.newVectorLayer();
      const tile = LayerFactory.newOsmLayer();
      map.addLayer(vector);
      map.addLayer(tile);
      map.setActiveLayer(vector);

      map.setTool(ToolRegistry.getById(MapTool.Circle));
      map.setActiveLayer(tile);

      expect(map.getCurrentTool()).toBeInstanceOf(CircleTool);
      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'Draw')).toEqual(0);
      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'Modify')).toEqual(0);
    });

    it('Set active layer should enable interaction (Tile -> Vector)', () => {
      const map = MapFactory.createNaked();
      const vector = LayerFactory.newVectorLayer();
      const tile = LayerFactory.newOsmLayer();

      map.addLayer(vector);
      map.addLayer(tile);
      map.setActiveLayer(tile);

      map.setTool(ToolRegistry.getById(MapTool.Circle));
      map.setActiveLayer(vector);

      expect(map.getCurrentTool()).toBeInstanceOf(CircleTool);
      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'Draw')).toEqual(1);
      expect(OlTestHelper.getInteractionCount(map.unwrap(), 'Modify')).toEqual(1);
    });
  });
});
