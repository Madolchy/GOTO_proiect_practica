import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConnectRouterService } from './connect-router.service';
import { connectNodeAdapter } from '@connectrpc/connect-node';
import type { Request, Response, NextFunction } from 'express';
import { NodeHandlerFn } from 'node_modules/@connectrpc/connect-node/dist/cjs/node-universal-handler';

@Injectable()
export class ConnectMiddleware implements NestMiddleware {
    private readonly connectHandler: NodeHandlerFn;
    private readonly connectPathRegex = /^\/[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+\/[A-Za-z0-9_]+$/;

    constructor(connectRouter: ConnectRouterService) {
        this.connectHandler = connectNodeAdapter({
            routes: (router) => connectRouter.register(router),
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        if (this.connectPathRegex.test(req.path)) {
            return this.connectHandler(req, res);
        }
        next();
    }
}
