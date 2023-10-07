import { Client } from './model';
import { generateActions } from '../../services/generators';
import { clientAggregate } from './aggregations';

const actions: any = generateActions({}, Client);

actions.index = async function ({ querymen: { query, cursor } }: any, res: any) {

    const resultsPromise = Client.aggregate(clientAggregate(query))
        .skip(cursor.skip)
        .limit(cursor.limit === 100 ? 10000 : cursor.limit);

    const countPromise: any = Client.aggregate(clientAggregate(query))
        .count('count');

    const [results, count] = await Promise.all([resultsPromise, countPromise]);

    res.set('Odin-Count', count[0] ? count[0].count : 0);
    res.send(results);
};

export { actions };
