import { Request } from 'express';
import {
  format,
  transports,
  createLogger,
  Logger as WinstonLogger,
} from 'winston';
import rTracer = require('cls-rtracer');
import { get, omit } from 'lodash';
import {
  logger as ExpressWinstonLogger,
  requestWhitelist,
  responseWhitelist,
} from 'express-winston';
import { ENV_PARAMS } from '../../config/default';
import { RequestMethod } from '../enums/request-method.enum';
import moment = require('moment');
import { SENSITIVE_DATA_LOGS_MASK_INFO } from '../constants/maskdata.constant';
import { getTracingId } from '../middlewares/distributed-tracing-middleware';
import { getExternalId, isValidJWT, parseJwt } from '../helpers/common.helpers';
import { LIGHT_API_HEALTH_END_POINT, PARTNER_GATEWAY_HEALTH_END_POINT, DL_MIDDLEWARE_HEALTH_END_POINT } from '../constants/common.constants';


const OMITTED_KEYS_FROM_LOG_OBJECT = [
  'message',
  'level',
  'timestamp',
  'namespace',
  'meta',
  'meta.req',
  'meta.res',
  'error',
  'error_stack',
];
const CONFIGURED_LOG_LEVEL = ENV_PARAMS.serverLogLevel || 'info';

// @ts-ignore
const addCustomAttributesToLogObject = format((info, opts) => {
  const data = {
    correlation_id: rTracer.id(),
    tracingId: getTracingId(),
    level: info.level,
    timestamp: info.timestamp,
    message: info.message,
    type: opts.tag,
  };
  if (opts.tag === 'app') {
    return {
      ...omit(info, OMITTED_KEYS_FROM_LOG_OBJECT),
      ...data,
      namespace: info.namespace,
      error: info.error,
      error_stack: info.error_stack,
      meta: info.meta,
    };
  } else {
    const authorizationToken = get(info, 'meta.req.headers["authorization"]');
    const authTokenPayload = authorizationToken && isValidJWT(authorizationToken)
      ? parseJwt(get(info, 'meta.req.headers["authorization"]'))
      : null;
    return {
      ...omit(info, OMITTED_KEYS_FROM_LOG_OBJECT),
      log: {
        ...data,
      },
      req: {
        url: get(info, 'meta.req.url'),
        method: get(info, 'meta.req.method'),
        referer: get(info, 'meta.req.headers.referer'),
        userAgent: get(info, 'meta.req.headers["user-agent"]'),
        userIp: get(info, 'meta.req.headers["x-forwarded-for"]'),
        httpVersion: get(info, 'meta.req.httpVersion'),
        body: get(info, 'meta.req.body'),
        query: get(info, 'meta.req.query'),
        ...(authTokenPayload && {
          userExternalId: getExternalId(
            authTokenPayload.partnerId,
            authTokenPayload.partnerCustomerId,
          ),
          userId: getCustomerIdFromJwtToken(
            get(info, 'meta.req.headers["authorization"]'),
          ),
          mobileNumber: authTokenPayload.mobileNumber,
        }),
      },
      res: {
        body: get(info, 'meta.res.body'),
        statusCode: get(info, 'meta.res.statusCode'),
      },
    };
  }
});

const CONFIGURED_TRANSPORTS = [
  new transports.Console({ level: CONFIGURED_LOG_LEVEL }),
];

const timezoned = () => {
  return moment().utcOffset('+05:30').format();
};

class AppLogger {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: timezoned }),
        addCustomAttributesToLogObject({ tag: 'app' }),
        format.json(),
      ),
      transports: CONFIGURED_TRANSPORTS,
    });
  }

  public info(namespace: string, meta?: object) {
    this.logger.log(`info`, '', {
      namespace,
      meta,
    });
  }

  public error(
    namespace: string,
    error: object | string,
    meta?: string | object,
  ) {
    this.logger.log(`error`, '', {
      namespace,
      error_stack: error instanceof Error ? error.stack : error,
      error,
      meta,
    });
  }

  public warn(namespace: string, meta?: object | string) {
    this.logger.log(`warn`, '', {
      namespace,
      meta,
    });
  }

  public debug(namespace: string, meta?: object | string) {
    this.logger.log(`debug`, '', {
      namespace,
      meta,
    });
  }

  public log(message: any, namespace: string) {
    this.logger.log(`info`, message, { namespace });
  }
}

export const Logger = new AppLogger();

export const ApiLoggerMiddleware = ExpressWinstonLogger({
  transports: CONFIGURED_TRANSPORTS,
  format: format.combine(
    format.timestamp({ format: timezoned }),
    addCustomAttributesToLogObject({ tag: 'access' }),
    format.json(),
  ),
  expressFormat: true,
  requestWhitelist: [...requestWhitelist, 'body'],
  responseWhitelist: [...responseWhitelist, 'body'],
  requestFilter: (req, propName) => {
    if (propName === 'body') {
      let maskedData = req.body;
      SENSITIVE_DATA_LOGS_MASK_INFO.forEach((info) => {
        if (req.url?.match(info.urlRegex)) {
          maskedData = info.maskUtility(req.body, info.maskOptions);
        }
      });
      req[propName] = maskedData;
      return req[propName];
    } else {
      return req[propName];
    }
  },
  ignoreRoute: (req: Request) => {
    const ignoredRoutes = [
      { method: RequestMethod.GET, path: LIGHT_API_HEALTH_END_POINT },
      { method: RequestMethod.GET, path: PARTNER_GATEWAY_HEALTH_END_POINT },
      { method: RequestMethod.GET, path: DL_MIDDLEWARE_HEALTH_END_POINT },
    ];

    const isExcludedPath = (request: Request): boolean => {
      const routeInfo = {
        path: request.url,
        method: RequestMethod[request.method],
      };
      return (
        ignoredRoutes.findIndex((route) => {
          return (
            route.path === routeInfo.path && route.method === routeInfo.method
          );
        }) > -1
      );
    };

    return isExcludedPath(req);
  },
});

export function getMobileNumberFromJwtToken(token: string) {
  try {
    const tokenSplits = token.split(' ');
    if (
      tokenSplits?.length &&
      tokenSplits[0].trim().toLocaleLowerCase() === 'bearer'
    ) {
      const jwtToken = tokenSplits[1];
      const tokenPayload = parseJwt(jwtToken);
      return tokenPayload['mobileNumber'];
    }
  } catch (err) {
    return undefined;
  }
  return undefined; // undefined is returned intentionally to avoid logging null
}

function getCustomerIdFromJwtToken(token: string) {
  try {
    const tokenSplits = token.split(' ');
    if (
      tokenSplits?.length &&
      tokenSplits[0].trim().toLocaleLowerCase() === 'bearer'
    ) {
      const jwtToken = tokenSplits[1];
      const tokenPayload = parseJwt(jwtToken);
      return tokenPayload['userId'];
    }
  } catch (err) {
    return undefined;
  }
  return undefined; // undefined is returned intentionally to avoid logging null
}


