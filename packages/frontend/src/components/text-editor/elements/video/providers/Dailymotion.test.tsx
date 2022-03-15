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

import { render } from '@testing-library/react';
import { Dailymotion } from './Dailymotion';

describe('Dailymotion', () => {
  let provider: Dailymotion;
  beforeEach(() => {
    provider = new Dailymotion();
  });

  it('should handle', () => {
    expect(provider.canHandle('https://www.dailymotion.com/video/x88qja8?playlist=x5nmbq')).toBe(true);
    expect(provider.canHandle('https://dai.ly/x88qja8')).toBe(true);
    expect(provider.canHandle('https://docs.slatejs.org/api/nodes')).toBe(false);
  });

  it('should return integration for long url', () => {
    const { container } = render(<div>{provider.getIntegration('https://www.dailymotion.com/video/x88qja8?playlist=x5nmbq')}</div>);
    expect(container).toMatchSnapshot();
  });

  it('should return integration for small url', () => {
    const { container } = render(<div>{provider.getIntegration('https://dai.ly/x88qja8')}</div>);
    expect(container).toMatchSnapshot();
  });
});
