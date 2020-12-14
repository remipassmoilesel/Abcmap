import { AbcLayer, AbcLayerMetadata, AbcProject } from '@abc-map/shared-entities';
import { Map } from 'ol';
import { Logger } from '../utils/Logger';
import { AbcProperties, LayerProperties } from './AbcProperties';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import * as E from 'fp-ts/Either';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { LayerFactory } from './LayerFactory';
import { MainStore } from '../store';
import * as _ from 'lodash';

const logger = Logger.get('MapService.ts');

export class MapService {
  constructor(private mainStore: MainStore) {}

  public getMainMap(): Map {
    return this.mainStore.getState().map.mainMap;
  }

  public resetMap(map: Map): void {
    map.getLayers().clear();
    map.addLayer(this.newOsmLayer());
  }

  /**
   * Return layers which belong to
   * @param map
   */
  public getManagedLayers(map: Map): BaseLayer[] {
    return map
      .getLayers()
      .getArray()
      .filter((lay) => !!lay.get(AbcProperties.Managed));
  }

  public newOsmLayer(): TileLayer {
    return LayerFactory.newOsmLayer();
  }

  public newVectorLayer(source?: VectorSource): VectorLayer {
    return LayerFactory.newVectorLayer(source);
  }

  public getMetadataFromLayer(layer: BaseLayer): AbcLayerMetadata | undefined {
    return LayerFactory.getMetadataFromLayer(layer);
  }

  public exportLayers(map: Map): AbcLayer[] {
    return this.getManagedLayers(map)
      .map((lay) => {
        const res = LayerFactory.olLayerToAbcLayer(lay);
        if (E.isLeft(res)) {
          logger.error('Export error: ', res);
          return undefined;
        }
        return res.right;
      })
      .filter((lay) => !!lay) as AbcLayer[];
  }

  public importProject(project: AbcProject, map: Map): void {
    map.getLayers().clear();
    project.layers
      .map((lay) => {
        const res = LayerFactory.abcLayerToOlLayer(lay);
        if (E.isLeft(res)) {
          logger.error('Export error: ', res);
          return undefined;
        }
        return res.right;
      })
      .filter((lay) => !!lay)
      .forEach((lay) => map.addLayer(lay as BaseLayer));
  }

  public setActiveLayer(map: Map, layer: BaseLayer): void {
    const id = layer.get(LayerProperties.Id);
    this.setActiveLayerById(map, id);
  }

  public setActiveLayerById(map: Map, layerId: string): void {
    const layers = this.getManagedLayers(map);

    const targetLayers = layers.find((lay) => lay.get(LayerProperties.Id) === layerId);
    if (!targetLayers) {
      throw new Error('Layer does not belong to map');
    }

    layers.forEach((lay) => {
      const id = lay.get(LayerProperties.Id);
      lay.set(LayerProperties.Active, id === layerId);
    });

    // Here we set a property to trigger change
    map.getLayers().set(AbcProperties.LastLayerActive, layerId);
  }

  public getActiveLayer(map: Map): BaseLayer | undefined {
    const layers = map.getLayers().getArray();
    return layers.find((lay) => lay.get(LayerProperties.Active));
  }

  public getActiveVectorLayer(map: Map): VectorLayer | undefined {
    const layer = this.getActiveLayer(map);
    if (!layer || !(layer instanceof VectorLayer)) {
      return;
    }

    return layer as VectorLayer;
  }

  public layersEquals(previous: BaseLayer[], current: BaseLayer[]) {
    const previousIds: string[] = previous.map((lay) => lay.get(LayerProperties.Id));
    const currentIds: string[] = current.map((lay) => lay.get(LayerProperties.Id));
    const previousActive = previous.find((lay) => lay.get(LayerProperties.Active))?.get(LayerProperties.Id);
    const currentActive = current.find((lay) => lay.get(LayerProperties.Active))?.get(LayerProperties.Id);

    return previousActive === currentActive && _.isEqual(previousIds, currentIds);
  }
}
