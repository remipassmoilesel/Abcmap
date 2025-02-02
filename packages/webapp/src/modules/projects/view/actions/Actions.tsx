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

import { FaIcon } from '../../../../components/icon/FaIcon';
import { IconDefs } from '../../../../components/icon/IconDefs';
import React from 'react';
import { useCreateNewProject } from '../../../../core/project/useCreateNewProject';
import { useImportProject } from '../../../../core/project/useImportProject';
import { useExportProject } from '../../../../core/project/useExportProject';
import { useSaveProjectOnline } from '../../../../core/project/useSaveProjectOnline';
import { useIsUserAuthenticated } from '../../../../core/authentication/useIsUserAuthenticated';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useAppSelector } from '../../../../core/store/hooks';

interface Props {
  className?: string;
}

export function Actions(props: Props) {
  const { className } = props;
  const { t } = useTranslation('ProjectManagement');
  const { lastSaveOnline, lastExport } = useAppSelector((st) => st.project);

  const userAuthenticated = useIsUserAuthenticated();

  const createNewProject = useCreateNewProject();
  const importProject = useImportProject();
  const exportProject = useExportProject();
  const saveProjectOnline = useSaveProjectOnline();

  return (
    <div className={clsx('d-flex flex-column', className)}>
      {/* Last save */}
      <div className={'d-flex mb-3'}>
        <small className={'me-3'}>
          {t('Last_export')}: {lastExport ? lastExport.toFormat('HH:mm') : t('Project_not_saved')}
        </small>
        <small>
          {t('Last_online_save')}: {lastSaveOnline ? lastSaveOnline.toFormat('HH:mm') : t('Project_not_saved')}
        </small>
      </div>

      <div className={'d-flex flex-wrap'}>
        <button onClick={exportProject} className={'btn btn-primary me-3 mb-2'} data-cy={'export-project'}>
          <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
          {t('Export_project')}
        </button>

        <button onClick={saveProjectOnline} disabled={!userAuthenticated} className={'btn btn-primary me-3 mb-2'} data-cy={'save-project'}>
          <FaIcon icon={IconDefs.faEarthEurope} className={'mr-2'} />
          {t('Save_project_online')}
        </button>

        <button onClick={importProject} className={'btn btn-outline-primary me-3 mb-2'} data-cy={'import-project'}>
          <FaIcon icon={IconDefs.faUpload} className={'mr-2'} />
          {t('Import_project')}
        </button>

        <button onClick={createNewProject} className={'btn btn-outline-primary me-3 mb-2'} data-cy={'new-project'}>
          <FaIcon icon={IconDefs.faFile} className={'mr-2'} />
          {t('New_project')}
        </button>
      </div>
    </div>
  );
}
