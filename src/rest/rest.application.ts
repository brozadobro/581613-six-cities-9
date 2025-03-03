import { inject, injectable } from 'inversify';
import express from 'express';

import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { Controller } from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private readonly server = express();

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.AuthorController) private readonly userController: Controller,
  ) { }

  private async initDb() {
    this.logger.info('Init database started');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    this.logger.info('Init database completed');
    return this.databaseClient.connect(mongoUri);
  }

  private async initServer() {
    this.logger.info('Try to init server…');
    const port = this.config.get('PORT');
    this.server.listen(port);
    this.logger.info(
      `Server started on http://localhost:${this.config.get('PORT')}`
    );
  }

  private async initMiddleware() {
    this.server.use(express.json());
  }

  private async initControllers() {
    this.logger.info('Init controllers');

    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);

    this.logger.info('Controller initialization completed');
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    await this.initDb();
    await this.initMiddleware();
    await this.initControllers();
    await this.initServer();
  }
}
