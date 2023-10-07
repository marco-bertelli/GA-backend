
import { Router } from 'express';

import { admin, password as passwordAuth, token } from '../../services/passport';
import { actions } from './controller';

// @ts-ignore
import { middleware as query } from 'querymen';

const router = new (Router as any)();

const queryBody = {
    q: {
        type: String, parse: (value: any, field: any) => {
            return {
                $or: [
                    { name: { $regex: value, $options: 'i' } },
                ]
            };
        }
    },
}

/**
 * @api {get} /articles List articles
 * @apiGroup Article
 * @apiName RetrieveAll
 * @apiPermission admin
 * @apiUse listParams
 * @apiSuccess {Article[]} articles List of articles.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 **/
router.get('/', token({ required: true }), query(queryBody), actions.index);

/**
 * @api {get} /articles/:id Retrieve Article
 * @apiGroup Article
 * @apiName Retrieve
 * @apiPermission user
 * @apiSuccess {Article} Article Article's data.
 * @apiError 401 Admin access only.
 * @apiError 404 Article not found.
 **/
router.get('/:id', token({ required: true }), actions.show);

/**
 * @api {post} /articles Create Article
 * @apiGroup Article
 * @apiName Create
 * @apiPermission user
 * @apiSuccess (Success 201) {Article} Article Article's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 * @apiError 409 Email already registered.
 **/
router.post('/', admin, actions.create);

/**
 * @api {put} /articles/:id Update Article
 * @apiGroup Article
 * @apiName Update
 * @apiPermission Article
 * @apiSuccess {Object} Article Article's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current Article or admin access only.
 * @apiError 404 Article not found.
 **/
router.put('/:id', admin, actions.update);

/**
 * @api {delete} /articles/:id Delete Article
 * @apiName Delete
 * @apiGroup Article
 * @apiPermission admin
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 Article not found.
 **/
router.delete('/:id', admin, actions.destroy);

export default router;
