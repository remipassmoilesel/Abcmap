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

import React, { MouseEvent, ReactNode } from 'react';
import Cls from './OptionRow.module.scss';

interface Props {
  children: ReactNode;
  onClick?: (ev: MouseEvent) => void;
  className?: string;
}

function OptionRow(props: Props) {
  const { children, onClick, className } = props;

  return (
    <div className={`${Cls.optionRow} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export default OptionRow;
