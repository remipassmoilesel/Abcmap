import React, { Component, ReactNode } from 'react';
import { Logger } from '../../core/utils/Logger';
import { HistoryKey } from '../../core/history/HistoryKey';
import { services } from '../../core/Services';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../core/store';
import './HistoryControls.scss';

const logger = Logger.get('HistoryControls.tsx', 'info');

interface LocalProps {
  historyKey: HistoryKey;
}

const mapStateToProps = (state: RootState) => ({
  capabilities: state.ui.historyCapabilities,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & LocalProps;

class HistoryControls extends Component<Props, {}> {
  private services = services();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render(): ReactNode {
    const canUndo = this.canUndo();
    const canRedo = this.canRedo();
    return (
      <div className={'control-block abc-history-controls'}>
        <div className={'control-item'}>
          <button onClick={this.onCancel} type={'button'} className={'btn btn-link'} disabled={!canUndo}>
            <i className={'fa fa-undo mr-2'} /> Annuler
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={this.onRedo} type={'button'} className={'btn btn-link'} disabled={!canRedo}>
            <i className={'fa fa-redo mr-2'} /> Refaire
          </button>
        </div>
      </div>
    );
  }

  private onCancel = () => {
    this.services.history.undo(this.props.historyKey).catch((err) => {
      logger.error(err);
      this.services.toasts.genericError();
    });
  };

  private onRedo = () => {
    this.services.history.redo(this.props.historyKey).catch((err) => {
      logger.error(err);
      this.services.toasts.genericError();
    });
  };

  private canUndo = (): boolean => {
    const capabilities = this.props.capabilities[this.props.historyKey];
    if (!capabilities) {
      return false;
    }
    return capabilities.canUndo;
  };

  private canRedo = (): boolean => {
    const capabilities = this.props.capabilities[this.props.historyKey];
    if (!capabilities) {
      return false;
    }
    return capabilities.canRedo;
  };
}

export default connector(HistoryControls);
