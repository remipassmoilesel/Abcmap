import React, { Component, ReactNode } from 'react';
import MainMap from './main-map/MainMap';
import { services } from '../../core/Services';
import LayerSelector from './layer-selector/LayerSelector';
import ProjectStatus from './project-status/ProjectStatus';
import { RootState } from '../../core/store';
import { connect, ConnectedProps } from 'react-redux';
import { Logger } from '../../core/utils/Logger';
import BaseLayer from 'ol/layer/Base';
import ProjectControls from './project-controls/ProjectControls';
import DrawingToolSelector from './drawing-tool-selector/DrawingToolSelector';
import './MapView.scss';

const logger = Logger.get('MapView.tsx', 'info');

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LocalProps {}

interface State {
  layers: BaseLayer[];
}

const mapStateToProps = (state: RootState) => ({
  project: state.project.current,
  map: state.map.mainMap,
  drawingTool: state.map.drawingTool,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

/**
 * Map layers are passed as props from here in order to update components "in a react way".
 */
class MapView extends Component<Props, State> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {
      layers: [],
    };
  }

  public render(): ReactNode {
    const project = this.props.project;
    return (
      <div className="abc-map-view">
        {/*Left menu*/}
        <div className="left-panel">
          <ProjectStatus project={project} />
          <ProjectControls project={this.props.project} map={this.props.map} />
          <div className={'control-block'}>
            <div className={'control-item'}>
              <button onClick={this.importFile} type={'button'} className={'btn btn-link'}>
                <i className={'fa fa-table mr-2'} /> Importer des données
              </button>
            </div>
            <div>
              <i>Vous pouvez importer des données en sélectionnant un fichier et en le déposant sur la carte</i>
            </div>
          </div>
          <div className={'control-block'}>
            <div className={'control-item'}>
              <button onClick={this.onCancel} type={'button'} className={'btn btn-link'}>
                <i className={'fa fa-undo mr-2'} /> Annuler
              </button>
            </div>
            <div className={'control-item'}>
              <button onClick={this.onRedo} type={'button'} className={'btn btn-link'}>
                <i className={'fa fa-redo mr-2'} /> Refaire
              </button>
            </div>
          </div>
        </div>

        {/*Main map*/}
        <MainMap map={this.props.map} drawingTool={this.props.drawingTool} onLayersChanged={this.onLayerChange} />

        {/*Right menu*/}
        <div className="right-panel">
          <div className={'control-block'}>
            <div className={'control-item'}>
              Rechercher sur la carte
              <input type={'text'} className={'d-block mt-2'} onKeyPress={this.onSearch} />
            </div>
          </div>
          <DrawingToolSelector layers={this.state.layers} />
          <LayerSelector map={this.props.map} layers={this.state.layers} />
        </div>
      </div>
    );
  }

  private onLayerChange = (layers: BaseLayer[]) => {
    this.setState({ layers });
  };

  private importFile = () => {
    this.services.toasts.info("Cette fonctionnalité n'est pas encore disponible");
  };

  private onSearch = () => {
    this.services.toasts.info("Cette fonctionnalité n'est pas encore disponible");
  };

  private onCancel = () => {
    this.services.toasts.info("Cette fonctionnalité n'est pas encore disponible");
  };

  private onRedo = () => {
    this.services.toasts.info("Cette fonctionnalité n'est pas encore disponible");
  };
}

export default connector(MapView);
