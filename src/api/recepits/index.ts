
import { Router } from 'express';

import { admin, password as passwordAuth, token } from '../../services/passport';
import { actions } from './controller';

// @ts-ignore
import { middleware as query } from 'querymen';

const router = new (Router as any)();
/**
 * @api {get} /recepits List recepits
 * @apiGroup Recepit
 * @apiName RetrieveAll
 * @apiPermission admin
 * @apiUse listParams
 * @apiSuccess {Recepit[]} recepits List of recepits.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 **/
router.get('/', token({ required: true }), query(), actions.index);

/**
 * @api {get} /recepits/:id Retrieve Recepit
 * @apiGroup Recepit
 * @apiName Retrieve
 * @apiPermission user
 * @apiSuccess {Recepit} Recepit Recepit's data.
 * @apiError 401 Admin access only.
 * @apiError 404 Recepit not found.
 **/
router.get('/:id', token({ required: true }), actions.show);

/**
 * @api {post} /recepits Create Recepit
 * @apiGroup Recepit
 * @apiName Create
 * @apiPermission user
 * @apiSuccess (Success 201) {Recepit} Recepit Recepit's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 * @apiError 409 Email already registered.
 **/
router.post('/', token({ required: true }), actions.create);

/**
 * @api {put} /recepits/:id Update Recepit
 * @apiGroup Recepit
 * @apiName Update
 * @apiPermission Recepit
 * @apiSuccess {Object} Recepit Recepit's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current Recepit or admin access only.
 * @apiError 404 Recepit not found.
 **/
router.put('/:id', token({ required: true }), actions.update);

/**
 * @api {post} /recepits/:id/pdf generate recepit pdf from groups
 * @apiGroup Recepit
 * @apiName GeneratePdf
 * @apiPermission Recepit
 * @apiSuccess {Object} Recepit Recepit's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current Recepit or admin access only.
 * @apiError 404 Recepit not found.
 **/
 router.post('/:id/pdf', token({ required: true }), actions.generatePdf);

/**
 * @api {delete} /recepits/:id Delete Recepit
 * @apiName Delete
 * @apiGroup Recepit
 * @apiPermission user
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 user access only.
 * @apiError 404 Recepit not found.
 **/
router.delete('/:id', token({ required: true }), actions.destroy);

export default router;
