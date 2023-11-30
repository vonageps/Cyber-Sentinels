import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository'
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {
  SFCoreBindings,
  SECURITY_SCHEME_SPEC,
} from '@sourceloop/core';
import {VideoChatBindings, VideoConfServiceComponent, VonageBindings} from '@sourceloop/video-conferencing-service'
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import * as openapi from './openapi.json';

export {ApplicationConfig};

export class VideoConfApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    const port = 3000;
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: process.env.NODE_ENV !== 'test',
      includeProcessEnv: true,
    });
    options.rest = options.rest ?? {};
    options.rest.basePath = process.env.BASE_PATH ?? '';
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    options.rest.openApiSpec = {
      endpointMapping: {
        [`${options.rest.basePath}/openapi.json`]: {
          version: '3.0.0',
          format: 'json',
        },
      },
    };

    super(options);

    // To check if monitoring is enabled from env or not
    const enableObf = !!+(process.env.ENABLE_OBF ?? 0);
    // To check if authorization is enabled for swagger stats or not
    const authentication =
      process.env.SWAGGER_USER && process.env.SWAGGER_PASSWORD ? true : false;
    this.bind(SFCoreBindings.config).to({
      enableObf,
      obfPath: process.env.OBF_PATH ?? '/obf',
      openapiSpec: openapi,
      authentication: authentication,
      swaggerUsername: process.env.SWAGGER_USER,
      swaggerPassword: process.env.SWAGGER_PASSWORD,
    });

    this.bind('sf.userAuthentication.currentUser').to({
      userTenantId: '35f4e956-8d01-411f-94ec-f80c00b83ccc',
      name: 'Test User',
    })

    this.bind(VideoChatBindings.Config).to({
      useCustomSequence: true
    })
    this.bind(VonageBindings.config).to({
      apiKey: process.env.VONAGE_API_KEY ?? '',
      apiSecret: process.env.VONAGE_API_SECRET ?? '',
      timeToStart: 0, // time in minutes, meeting can not be started 'timeToStart' minutes before the scheduled time
    });

  this.component(VideoConfServiceComponent);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.component(RestExplorerComponent);


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.api({
      openapi: '3.0.0',
      info: {
        title: 'video-conf',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
  }
}
