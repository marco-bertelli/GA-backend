import { Recepit } from './model';
import { generateActions } from '../../services/generators';
import { createPdf } from '../../services/jsReport/generator';
import { RecepitGroup } from '../recepit_groups/model';
import { generateDeliveryTxtFile } from './helpers';
import { RecepitGroupDocument } from '../recepit_groups/interfaces';

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

actions.generateDeliveryFile = async ({ params: { id } }: any, res: any) => {
    const recepit = await Recepit.findById(id).populate(populationOptions).exec();

    if (!recepit) {
        return res.status(404).send({ message: 'recepit not found' });
    }

    const groups = await RecepitGroup.find({ recepitId: recepit._id }).lean();

    recepit.deliveryFileUrl = await generateDeliveryTxtFile(groups as RecepitGroupDocument[], recepit);

    await recepit.save();

    res.send(recepit)
}

export { actions };
