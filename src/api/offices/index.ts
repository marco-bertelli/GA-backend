import { Router } from 'express';

import { admin, token } from '../../services/passport';
import { actions } from './controller';

// @ts-ignore
import { middleware as query } from 'querymen';

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

const router = new (Router as any)();
/**
 * @api {get} /offices List offices
 * @apiGroup Office
 * @apiName RetrieveAll
 * @apiPermission admin
 * @apiUse listParams
 * @apiSuccess {Office[]} offices List of offices.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 **/
router.get('/', token({ required: true }), query(queryBody), actions.index);

/**
 * @api {get} /offices/:id/dashboard office dashboard (pass fromDate and toDate in query)
 * @apiGroup Office
 * @apiName RetrieveAll
 * @apiPermission admin
 * @apiUse listParams
 * @apiSuccess {Office[]} offices List of offices.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 **/
router.get('/:id/dashboard', admin, actions.dashboard);

/**
 * @api {get} /offices/:id Retrieve Office
 * @apiGroup Office
 * @apiName Retrieve
 * @apiPermission user
 * @apiSuccess {Office} Office Office's data.
 * @apiError 401 Admin access only.
 * @apiError 404 Office not found.
 **/
router.get('/:id', token({ required: true }), actions.show);

/**
 * @api {post} /offices Create Office
 * @apiGroup Office
 * @apiName Create
 * @apiPermission user
 * @apiSuccess (Success 201) {Office} Office Office's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 * @apiError 409 Email already registered.
 **/
router.post('/', token({ required: true }), actions.create);

/**
 * @api {put} /offices/:id Update Office
 * @apiGroup Office
 * @apiName Update
 * @apiPermission Office
 * @apiSuccess {Object} Office Office's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current Office or admin access only.
 * @apiError 404 Office not found.
 **/
router.put('/:id', token({ required: true }), actions.update);

/**
 * @api {delete} /offices/:id Delete Office
 * @apiName Delete
 * @apiGroup Office
 * @apiPermission admin
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 Office not found.
 **/
router.delete('/:id', admin, actions.destroy);

export default router;
