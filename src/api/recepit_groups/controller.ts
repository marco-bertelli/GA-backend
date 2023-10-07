import { RecepitGroup } from './model';
import { generateActions } from '../../services/generators';

const actions: any = generateActions({}, RecepitGroup);

export { actions };
