import { MapFactory } from './MapFactory';
import { E2eMapWrapper } from './E2eMapWrapper';
import { TestHelper } from '../../utils/TestHelper';
import { LayerFactory } from '../layers/LayerFactory';

describe('E2eMapWrapper', function () {
  it('getLayersMetadata()', function () {
    const map = MapFactory.createNaked();
    const e2e = new E2eMapWrapper(map);
    const layer1 = LayerFactory.newOsmLayer();
    const layer2 = LayerFactory.newVectorLayer();
    map.addLayer(layer1);
    map.addLayer(layer2);

    const metadata = e2e.getLayersMetadata();
    expect(metadata).toEqual([layer1.getMetadata(), layer2.getMetadata()]);
  });

  it('getActiveLayerFeatures()', function () {
    const map = MapFactory.createNaked();
    const e2e = new E2eMapWrapper(map);
    const layer1 = LayerFactory.newVectorLayer();
    const layer2 = LayerFactory.newOsmLayer();
    const features = TestHelper.sampleFeatures();
    map.addLayer(layer1);
    map.addLayer(layer2);

    layer1.unwrap().getSource().addFeatures(features);

    map.setActiveLayer(layer1);
    expect(e2e.getActiveLayerFeatures()).toEqual(features);

    map.setActiveLayer(layer2);
    expect(e2e.getActiveLayerFeatures()).toEqual([]);
  });
});
