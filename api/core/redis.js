import { createClient } from 'then-redis';
import config from '../../config.json';

export default {
	client: createClient(config.redis),
	baseKey: 'newimg',
};
