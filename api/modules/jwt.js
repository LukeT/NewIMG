import redis from '../core/redis';

export default (decoded, req, cb) => {
	redis.client.get(`${redis.baseKey}:jwt:${decoded.sid}`)
		.then(redisData => {
			if (redisData) {
				cb(null, true);
			} else {
				cb(null, false);
			}
		}).catch(err => {
			cb(err, false);
		});
};
