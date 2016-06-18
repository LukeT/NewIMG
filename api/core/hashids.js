import config from '../../config.json';
import Hashids from 'hashids';

export default new Hashids(config.hashids.salt);
