import { getServices, Services } from '../../../core/Services';
import { HistoryKey } from '../../../core/history/HistoryKey';
import { RemoveFeaturesTask } from '../../../core/history/tasks/features/RemoveFeaturesTask';
import { Logger } from '@abc-map/frontend-shared';
import { Shortcuts } from './Shortcuts';

const logger = Logger.get('MapKeyboardListener.ts');

export class MapKeyboardListener {
  public static create() {
    return new MapKeyboardListener(getServices());
  }

  constructor(private services: Services) {}

  public initialize(): void {
    const body = document.querySelector('body');
    if (!body) {
      logger.error('Body element not ready');
      return;
    }

    body.addEventListener('keypress', this.handleKeyPress);
  }

  public destroy(): void {
    const body = document.querySelector('body');
    if (!body) {
      logger.error('Body element not ready');
      return;
    }

    body.removeEventListener('keypress', this.handleKeyPress);
  }

  /**
   * Handle keyboard events.
   *
   * This method is public for tests purposes.
   * @param ev
   */
  public handleKeyPress = (ev: KeyboardEvent) => {
    const fromForm = ev.target instanceof Node && ['INPUT', 'TEXTAREA'].indexOf(ev.target.nodeName) !== -1;
    if (fromForm) {
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();

    if (Shortcuts.isDelete(ev)) {
      this.deleteSelectedFeatures();
    } else if (Shortcuts.isRedo(ev)) {
      this.redo();
    } else if (Shortcuts.isUndo(ev)) {
      this.undo();
    }
  };

  private deleteSelectedFeatures() {
    const { history, geo } = this.services;

    const map = geo.getMainMap();
    const layer = map.getActiveVectorLayer();
    const features = map.getSelectedFeatures();
    if (!layer || !features.length) {
      return;
    }

    features.forEach((f) => layer.getSource().removeFeature(f.unwrap()));
    history.register(HistoryKey.Map, new RemoveFeaturesTask(layer.getSource(), features));
  }

  private undo() {
    const { toasts, history } = this.services;

    if (history.canUndo(HistoryKey.Map)) {
      history.undo(HistoryKey.Map).catch((err) => logger.error(err));
    } else {
      toasts.info("Il n'y a plus rien à annuler");
    }
  }

  private redo() {
    const { toasts, history } = this.services;

    if (history.canRedo(HistoryKey.Map)) {
      history.redo(HistoryKey.Map).catch((err) => logger.error(err));
    } else {
      toasts.info("Il n'y a plus rien à refaire");
    }
  }
}
