import redisclient from "../connection_config/redisConfig.js";
export const SetData = async (cachekey, cache_expiry, data) => {
  return redisclient.setex(cachekey, cache_expiry, JSON.stringify(data));
};
export const GetData = async (cachekey) => {
  return redisclient.get(cachekey);
};
export const DeleteData = async (cachekey) => {
  return redisclient.del(cachekey);
};
