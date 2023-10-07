import { Article } from './model';
import { generateActions } from '../../services/generators';

const actions: any = generateActions({}, Article);

actions.index = async function ({ querymen: { query, cursor }, user }: any, res: any) {

    const userQuery = user.role === 'admin' ? {} : { articleType: 'user' }

    const results = await Article.find({...query, ...userQuery})
        .skip(cursor.skip)
        .limit(cursor.limit)
        .sort(cursor.sort);

    const count = await Article.countDocuments(query);

    res.set('Odin-Count', count);
    res.send(results);
};


export { actions };
