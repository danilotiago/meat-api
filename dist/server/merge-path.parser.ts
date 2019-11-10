import * as restify from 'restify';

const mpContentType = 'application/merge-patch+json';

export const mergePatchBodyParser = (req: restify.Request, resp: restify.Response, next) => {

    if (req.getContentType() === mpContentType &&
        req.method === 'PATCH') {
        
        // guarda o body original antes de tentar converter
        (<any>req).rawBody = req.body;
        
        try {
            req.body = JSON.parse(req.body);
        } catch (err) {
            next(new Error(`Invalid content: ${err.message}`));
        }
    }

    return next();
}