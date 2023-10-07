import { Office } from './model';
import { generateActions } from '../../services/generators';
import { Recepit } from '../recepits/model';

import * as _ from 'lodash';
import { officeMonthlyAggregate, userMonthlyAggregate } from './aggregations';

const actions: any = generateActions({}, Office);

actions.dashboard = async function ({ query: { fromDate, toDate }, params: { id } }: any, res: any) {
    if (_.isNil(id)) {
        return res.status(400).send('provide id field')
    }

    if (_.isNil(fromDate)) {
        return res.status(400).send('provide fromDate field')
    }

    if (_.isNil(toDate)) {
        return res.status(400).send('provide toDate field')
    }

    const officeResult = await Recepit.aggregate(officeMonthlyAggregate(id, fromDate, toDate));
    const operatorResult = await Recepit.aggregate(userMonthlyAggregate(id, fromDate, toDate))

    res.send({
        officeResult: officeResult,
        operatorResult: operatorResult
    })
}

export { actions };
