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

import HistoryControls from '../../../../components/history-controls/HistoryControls';
import { HistoryKey } from '../../../../core/history/HistoryKey';
import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import React, { useCallback, useState } from 'react';
import { useServices } from '../../../../core/useServices';
import { AbcSharedView, LayerState, Logger } from '@abc-map/shared';
import SharingCodesModal from '../sharing-codes-modal/SharingCodesModal';
import { nanoid } from 'nanoid';
import { AddSharedViewChangeset } from '../../../../core/history/changesets/shared-views/AddSharedViewChangeset';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useAppSelector } from '../../../../core/store/hooks';
import LayerVisibilitySelector from './layer-selector/LayerVisibilitySelector';
import { UpdateSharedViewsChangeset } from '../../../../core/history/changesets/shared-views/UpdateSharedViewChangeset';
import isEqual from 'lodash/isEqual';
import { withTranslation } from 'react-i18next';
import { useSaveProjectOnline } from '../../../../core/project/useSaveProjectOnline';
import { ProjectStatus } from '../../../../core/project/ProjectStatus';

const t = prefixedTranslation('ShareSettingsView:');

const logger = Logger.get('SharingControls.tsx');

function SharingControls() {
  const saveProject = useSaveProjectOnline();
  const { project, geo, history } = useServices();
  const [codesModal, showCodesModal] = useState(false);
  const views = useAppSelector((st) => st.project.sharedViews.list);
  const activeViewId = useAppSelector((st) => st.project.sharedViews.activeId);
  const activeView = views.find((v) => v.id === activeViewId);

  const handlePublish = useCallback(() => {
    saveProject().catch((err) => logger.error('Cannot save project: ', err));
  }, [saveProject]);

  const handleShowPreview = useCallback(() => {
    saveProject()
      .then((status) => {
        if (ProjectStatus.Ok === status) {
          const url = project.getPublicLink();
          window.open(url, '_blank')?.focus();
        }
      })
      .catch((err) => logger.error('Preview error: ', err));
  }, [project, saveProject]);

  const handleToggleSharingCodes = useCallback(() => showCodesModal(!codesModal), [codesModal]);

  const handleNewSharedView = useCallback(() => {
    const add = async () => {
      // Create new view from main map
      const map = geo.getMainMap();
      const id = nanoid();
      const title = `${t('View')} ${views.length}`;
      const layers = map
        .getLayers()
        .map((l) => ({ layerId: l.getId(), visible: true }))
        .filter((st): st is LayerState => !!st.layerId);
      const view: AbcSharedView = { id, title, view: map.getView(), layers };

      // Create change set, apply and register it
      const cs = AddSharedViewChangeset.create([view]);
      await cs.apply();
      history.register(HistoryKey.SharedViews, cs);

      // Set new layer as active
      project.setActiveSharedView(id);
    };

    add().catch((err) => logger.error('Cannot add layer: ', err));
  }, [geo, history, project, views.length]);

  const handleDisableSharing = useCallback(() => {
    project.setPublic(false);
    saveProject().catch((err) => {
      logger.error('Cannot publish project: ', err);
      project.setPublic(true);
    });
  }, [project, saveProject]);

  const handleUpdate = useCallback(
    (view: AbcSharedView) => {
      if (!activeView || isEqual(activeView, view)) {
        return;
      }

      const cs = UpdateSharedViewsChangeset.create([{ before: activeView, after: view }]);
      cs.apply()
        .then(() => history.register(HistoryKey.SharedViews, cs))
        .catch((err) => logger.error('Cannot update view: ', err));
    },
    [activeView, history]
  );

  return (
    <>
      <HistoryControls historyKey={HistoryKey.SharedViews} />

      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={handleShowPreview} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faEye} className={'mr-2'} />
            {t('Overview')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handlePublish} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faUpload} className={'mr-2'} />
            {t('Publish')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handleToggleSharingCodes} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faLink} className={'mr-2'} />
            {t('Address_and_share_code')}
          </button>
        </div>
        <div className={'control-item'}>
          <button onClick={handleDisableSharing} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faBan} className={'mr-2'} />
            {t('Disable_sharing')}
          </button>
        </div>
      </div>

      <div className={'control-block'}>
        <div className={'control-item'}>
          <button onClick={handleNewSharedView} className={'btn btn-link'}>
            <FaIcon icon={IconDefs.faPlus} className={'mr-2'} />
            {t('New_view')}
          </button>
        </div>
      </div>

      {activeView && (
        <div className={'control-block'}>
          <div className={'control-item'}>{t('Visible_layers')}</div>
          <LayerVisibilitySelector view={activeView} onUpdate={handleUpdate} />
        </div>
      )}

      {codesModal && <SharingCodesModal onClose={handleToggleSharingCodes} />}
    </>
  );
}

export default withTranslation()(SharingControls);
