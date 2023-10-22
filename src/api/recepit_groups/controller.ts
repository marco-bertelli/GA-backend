import { RecepitGroup } from './model';
import { generateActions } from '../../services/generators';
import { createPdf } from '../../services/jsReport/generator';

const actions: any = generateActions({}, RecepitGroup);

actions.generatePdf = async ({ params: { id } }: any, res: any) => {
    const recepit_group = await RecepitGroup.findById(id);

    if (!recepit_group) {
        return res.status(404).send({ message: 'recepit group not found' });
    }

    recepit_group.pdfUrl = await createPdf(
        {
            ...recepit_group.article,
            qty: recepit_group.qty
        },
        'GA-shipping-label',
        'label_',
        recepit_group._id,
        recepit_group
    );

    await recepit_group.save();

    res.send(recepit_group)
}

export { actions };
