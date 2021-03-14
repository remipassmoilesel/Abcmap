import React, { Component, ReactNode } from 'react';
import { Logger } from '@abc-map/frontend-shared';
import { Link } from 'react-router-dom';
import { FrontendRoutes } from '@abc-map/frontend-shared';
import './NotFound.scss';

const logger = Logger.get('NotFound.tsx');

class NotFound extends Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={'abc-not-found'}>
        <h3>Cette page n&apos;existe pas !</h3>
        <Link to={FrontendRoutes.landing()}>Retourner à l&apos;accueil</Link>
      </div>
    );
  }
}

export default NotFound;
