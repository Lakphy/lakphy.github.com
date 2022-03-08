import { baseUrl, qweatherKey, amapKey } from "./config.js";
// api

// 通过ip获取定位
export const Ip2Location = () => {
  return fetch(`${baseUrl.amapApi}/ip?key=${amapKey}`).then((response) =>
    response.json()
  );
};
// 查询城市(逆地址解析)
export const cityLookup = (locationString) => {
  return fetch(
    `${baseUrl.geoQweatherApi}/city/lookup?key=${qweatherKey}&location=${locationString}&range=cn`
  ).then((response) => response.json());
};
// 获取实时天气
export const weatherNow = (locationString) => {
  return fetch(
    `${baseUrl.devQweatherApi}/weather/now?key=${qweatherKey}&location=${locationString}`
  ).then((response) => response.json());
};
// 未来24h逐小时天气
export const weather24hours = (locationString) => {
  return fetch(
    `${baseUrl.devQweatherApi}/weather/24h?key=${qweatherKey}&location=${locationString}`
  ).then((response) => response.json());
};
// 未来7天逐天天气
export const weather7days = (locationString) => {
  return fetch(
    `${baseUrl.devQweatherApi}/weather/7d?key=${qweatherKey}&location=${locationString}`
  ).then((response) => response.json());
};
// 分钟级降水
export const waterMinutely = (locationString) => {
  return fetch(
    `${baseUrl.devQweatherApi}/minutely/5m?key=${qweatherKey}&location=${locationString}`
  ).then((response) => response.json());
};
// 分钟级降水
export const indices1day = (locationString) => {
  return fetch(
    `${baseUrl.devQweatherApi}/indices/1d?key=${qweatherKey}&location=${locationString}&type=1,2,3,4,5,6,7,8,9,11,12,13,14,15,16`
  ).then((response) => response.json());
};
// 天气灾害预警
export const weatherWarning = (locationString) => {
  return fetch(
    `${baseUrl.devQweatherApi}/warning/now?key=${qweatherKey}&location=${locationString}`
  ).then((response) => response.json());
};
// 天气灾害预警
export const airCondition = (locationString) => {
  return fetch(
    `${baseUrl.devQweatherApi}/air/now?key=${qweatherKey}&location=${locationString}`
  ).then((response) => response.json());
};
