import { MapService } from './MapService';
import { AbcPredefinedLayer, AbcProject, AbcVectorLayer, LayerType, PredefinedLayerModel } from '@abc-map/shared-entities';
import { AbcProperties, LayerProperties } from './AbcProperties';
import { TestHelper } from '../utils/TestHelper';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import * as uuid from 'uuid';
import { MainStore } from '../store';
import { MapFactory } from './MapFactory';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    const storeMock: MainStore = {} as any;
    service = new MapService(storeMock);
  });

  it('resetMap()', () => {
    const map = MapFactory.newDefaultMap();
    map.addLayer(service.newVectorLayer());

    service.resetMap(map);
    const layers = map.getLayers().getArray();
    expect(layers).toHaveLength(1);
    expect(layers[0].get(LayerProperties.Type)).toEqual(LayerType.Predefined);
  });

  // TODO: improve tests
  it('exportLayers()', () => {
    const map = MapFactory.newDefaultMap();
    const osm = service.newOsmLayer();
    const features = service.newVectorLayer(new VectorSource({ features: TestHelper.sampleFeatures() }));
    map.addLayer(osm);
    map.addLayer(features);
    service.setActiveLayer(map, features);

    const layers = service.exportLayers(map);
    expect(layers).toHaveLength(2);

    expect(layers[0].metadata.type).toEqual(LayerType.Predefined);
    expect(layers[0].metadata.active).toEqual(false);
    expect((layers[0] as AbcPredefinedLayer).model).toEqual(PredefinedLayerModel.OSM);

    expect(layers[1].metadata.type).toEqual(LayerType.Vector);
    expect(layers[1].metadata.active).toEqual(true);
    expect((layers[1] as AbcVectorLayer).features.features).toHaveLength(3);
  });

  // TODO: improve tests
  it('importProject()', () => {
    const project: AbcProject = TestHelper.sampleProject();

    const map = MapFactory.newDefaultMap();

    service.importProject(project, map);
    const layers = map.getLayers().getArray();

    expect(layers[0]).toBeInstanceOf(TileLayer);
    expect(layers[1]).toBeInstanceOf(VectorLayer);
    expect((layers[1] as VectorLayer).getSource().getFeatures()).toHaveLength(1);
    expect((layers[1] as VectorLayer).getSource().getFeatures()[0].getGeometry()?.getType()).toEqual('Point');
  });

  describe('setActiveLayer()', () => {
    it('on wrong layer', () => {
      const map = MapFactory.newDefaultMap();
      const layer1 = service.newOsmLayer();

      expect(() => {
        service.setActiveLayer(map, layer1);
      }).toThrow(new Error('Layer does not belong to map'));
    });

    it('once', () => {
      const map = MapFactory.newDefaultMap();
      const layer1 = service.newOsmLayer();
      const layer2 = service.newVectorLayer();
      const layer3 = service.newVectorLayer();
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);

      service.setActiveLayer(map, layer2);
      const layers = map.getLayers();
      expect(layers.getLength()).toEqual(3);
      expect(layers.get(AbcProperties.LastLayerActive)).toEqual(layer2.get(LayerProperties.Id));
      expect(layers.getArray()[0].get(LayerProperties.Active)).toEqual(false);
      expect(layers.getArray()[1].get(LayerProperties.Active)).toEqual(true);
      expect(layers.getArray()[2].get(LayerProperties.Active)).toEqual(false);
    });

    it('twice', () => {
      const map = MapFactory.newDefaultMap();
      const layer1 = service.newOsmLayer();
      const layer2 = service.newVectorLayer();
      const layer3 = service.newVectorLayer();
      map.addLayer(layer1);
      map.addLayer(layer2);
      map.addLayer(layer3);

      service.setActiveLayer(map, layer2);
      service.setActiveLayer(map, layer3);
      const layers = map.getLayers();
      expect(layers.getLength()).toEqual(3);
      expect(layers.get(AbcProperties.LastLayerActive)).toEqual(layer3.get(LayerProperties.Id));
      expect(layers.getArray()[0].get(LayerProperties.Active)).toEqual(false);
      expect(layers.getArray()[1].get(LayerProperties.Active)).toEqual(false);
      expect(layers.getArray()[2].get(LayerProperties.Active)).toEqual(true);
    });
  });

  describe('layersEquals()', () => {
    it('same ids, two active layer', () => {
      const id = uuid.v4();
      const layer1 = new VectorLayer();
      const layer2 = new VectorLayer();

      layer1.set(LayerProperties.Id, id);
      layer1.set(LayerProperties.Active, true);
      layer2.set(LayerProperties.Id, id);
      layer2.set(LayerProperties.Active, true);

      const result = service.layersEquals([layer1], [layer2]);
      expect(result).toBeTruthy();
    });

    it('same ids, one active layer', () => {
      const id = uuid.v4();
      const layer1 = new VectorLayer();
      const layer2 = new VectorLayer();

      layer1.set(LayerProperties.Id, id);
      layer1.set(LayerProperties.Active, true);
      layer2.set(LayerProperties.Id, id);
      layer2.set(LayerProperties.Active, false);

      const result = service.layersEquals([layer1], [layer2]);
      expect(result).toBeFalsy();
    });

    it('different ids, two active layer', () => {
      const layer1 = new VectorLayer();
      const layer2 = new VectorLayer();

      layer1.set(LayerProperties.Id, uuid.v4());
      layer1.set(LayerProperties.Active, false);
      layer2.set(LayerProperties.Id, uuid.v4());
      layer2.set(LayerProperties.Active, false);

      const result = service.layersEquals([layer1], [layer2]);
      expect(result).toBeFalsy();
    });
  });
});
