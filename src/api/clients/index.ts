
import { Router } from 'express';

import { admin, token } from '../../services/passport';
import { actions } from './controller';

// @ts-ignore
import { middleware as query } from 'querymen';

const queryBody = {
    q: {
        type: String, parse: (value: any, field: any) => {
            const splittedValue = value.split(' ');

            const nameQuery = splittedValue.map((mappedValue: any) => { return { name: { $regex: mappedValue, $options: 'i' } } });
            const surnameQuery = splittedValue.map((mappedValue: any) => { return { surname: { $regex: mappedValue, $options: 'i' } } });
            return {
                $or: [
                    { $or: nameQuery },
                    { $or: surnameQuery }
                ]
            };
        }
    },
}

const router = new (Router as any)();
/**
 * @api {get} /clients List clients
 * @apiGroup Client
 * @apiName RetrieveAll
 * @apiPermission admin
 * @apiUse listParams
 * @apiSuccess {Client[]} clients List of clients.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 **/
router.get('/', token({ required: true }), query(queryBody), actions.index);

/**
 * @api {get} /clients/:id Retrieve Client
 * @apiGroup Client
 * @apiName Retrieve
 * @apiPermission user
 * @apiSuccess {Client} Client Client's data.
 * @apiError 401 Admin access only.
 * @apiError 404 Client not found.
 **/
router.get('/:id', token({ required: true }), actions.show);

/**
 * @api {post} /clients Create Client
 * @apiGroup Client
 * @apiName Create
 * @apiPermission user
 * @apiSuccess (Success 201) {Client} Client Client's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 * @apiError 409 Email already registered.
 **/
router.post('/', token({ required: true }), actions.create);

/**
 * @api {put} /clients/:id Update Client
 * @apiGroup Client
 * @apiName Update
 * @apiPermission Client
 * @apiSuccess {Object} Client Client's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current Client or admin access only.
 * @apiError 404 Client not found.
 **/
router.put('/:id', token({ required: true }), actions.update);

/**
 * @api {delete} /clients/:id Delete Client
 * @apiName Delete
 * @apiGroup Client
 * @apiPermission admin
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 Client not found.
 **/
router.delete('/:id', admin, actions.destroy);

export default router;
