import { Recepit } from './model';
import { generateActions } from '../../services/generators';
import { createPdf } from '../../services/jsReport/generator';

const populationOptions = ['recepitGroups', 'client', 'creator']

const actions: any = generateActions({}, Recepit, populationOptions);

actions.index = async function ({ querymen: { query, cursor }, user }: any, res: any) {
    const aclQuery = { ...query, creatorId: user.role === 'admin' ? { $exists: true } : user._id }

    const results = await Recepit.find(aclQuery)
        .skip(cursor.skip)
        .limit(cursor.limit)
        .sort(cursor.sort)
        .populate(populationOptions)
        .exec();

    const count = await Recepit.countDocuments(aclQuery);

    res.set('Odin-Count', count);
    res.send(results);
};

actions.generatePdf = async ({ params: { id } }: any, res: any) => {
    const recepit = await Recepit.findById(id).populate(populationOptions).exec();

    recepit.pdfUrl = await createPdf(recepit, 'CAF_recepit', 'recepit_', recepit.code, recepit);
    await recepit.save();

    res.send(recepit)
}

export { actions };
