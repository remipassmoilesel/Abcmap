import express = require('express');
import morgan = require('morgan');
import expressWebsocket = require('express-ws');
import * as _ from 'lodash';
import * as loglevel from 'loglevel';
import {AbcApiConfig} from '../../AbcApiConfig';
import {IControllerMap} from "./IControllerMap";

export class ApiServer {

    private logger = loglevel.getLogger('ApiServer');

    private app: express.Application;

    constructor(private config: AbcApiConfig,
                private controllers: IControllerMap) {
        this.app = express();
        expressWebsocket(this.app);

        this.setupMorgan(this.app);
        this.setupControllers(this.app);
        this.setupGuiService(this.app);
    }

    public start() {
        this.app.listen(this.config.PORT, () => {
            this.logger.info(`Server started on port ${this.config.PORT}`);
        });
    }

    private setupControllers(app: express.Application) {
        _.forEach(_.values(this.controllers), (gr) => app.use(gr.getRouter()));
    }

    private setupGuiService(app: express.Application) {
        app.use(express.static('gui-dist'));
    }

    private setupErrorHandler(app: express.Application) {
        app.use((err: Error, req: express.Request, res: express.Response, next: any) => {
            this.logger.error(err);
            next();
        });
    }

    private setupMorgan(app: express.Application) {
        app.use(morgan('tiny'));
    }
}
