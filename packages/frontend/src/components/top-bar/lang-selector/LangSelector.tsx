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

import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { LabeledLanguages } from '../../../i18n/Languages';
import { getLang, setLang } from '../../../i18n/i18n';
import { Language, Logger } from '@abc-map/shared';
import Cls from './LangSelector.module.scss';

const logger = Logger.get('LangSelector.tsx');

class LangSelector extends React.Component<{}, {}> {
  public render() {
    const currentLang = LabeledLanguages.All.find((l) => l.value === getLang());

    return (
      <Dropdown data-cy={'lang-selector'}>
        {/* Menu icon */}
        <Dropdown.Toggle variant="light" className={'d-flex justify-content-center align-items-center'}>
          <img src={currentLang?.icon} alt={currentLang?.label} className={Cls.selected} title={currentLang?.label} />
        </Dropdown.Toggle>

        {/* Menu items */}
        <Dropdown.Menu className={Cls.dropdown}>
          {LabeledLanguages.All.map((lang) => {
            return (
              <Dropdown.Item key={lang.value} onClick={() => this.setLang(lang.value)} className={`d-flex align-items-center`}>
                <img src={lang.icon} alt={lang.label} className={'mr-2'} /> {lang.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  private setLang = (lang: Language) => {
    setLang(lang).catch((err) => logger.error('Cannot set lang: ', err));
  };
}

export default LangSelector;
