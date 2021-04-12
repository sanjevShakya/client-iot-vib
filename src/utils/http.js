import axios from "axios";

import config from "../config";

const instance = axios.create({
  baseURL: config.baseURI,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @param {String} url The url for the api request (without the base).
 * @param {Object} [config]
 * @param {Object} [config.params] An object of queries that will be added to
 * the url.
 * @param {Boolean} [config.accessToken] Whether or not to include the
 * access-token header.
 * @returns {Promise}
 */
function get(
  url,
  { params = {}, accessToken = true, responseType = "json", headers = {} } = {}
) {
  const authHeaders = {};

  return instance({
    url,
    params,
    responseType,
    method: "get",
    headers: { ...authHeaders, ...headers },
  }).then((response) => response);
}

/**
 * @param {String} url The url for the api request (without the base).
 * @param {Object} [config]
 * @param {Object} [config.params] An object of queries that will be added to
 * the url.
 * @param {Object} [config.body] An object that will be sent in the request
 * body.
 * @param {Boolean} [config.accessToken] Whether or not to include the
 * access-token header.
 * @returns {Promise}
 */
function post(
  url,
  { params = {}, body = {}, accessToken = true, headers = {} } = {}
) {
  const authHeaders = {};
  return instance({
    url,
    params,
    data: body,
    method: "post",
    headers: { ...authHeaders, ...headers },
  }).then((response) => response);
}

/**
 * @param {String} url The url for the api request (without the base).
 * @param {Object} [config]
 * @param {Object} [config.params] An object of queries that will be added to
 * the url.
 * @param {Object} [config.body] An object that will be sent in the request
 * body.
 * @param {Boolean} [config.accessToken] Whether or not to include the
 * access-token header.
 * @returns {Promise}
 */
function put(
  url,
  { params = {}, body = {}, accessToken = true, headers = {} } = {}
) {
  const authHeaders = {};

  return instance({
    url,
    params,
    data: body,
    method: "put",
    headers: { ...authHeaders, ...headers },
  }).then((response) => response);
}

/**
 * @param {String} url The url for the api request (without the base).
 * @param {Object} [config]
 * @param {Object} [config.params] An object of queries that will be added to
 * the url.
 * @param {Boolean} [config.accessToken] Whether or not to include the
 * access-token header.
 * @returns {Promise}
 */
function remove(url, { params = {}, accessToken = true, headers = {} } = {}) {
  const authHeaders = {};

  return instance({
    url,
    params,
    method: "delete",
    headers: { ...authHeaders, ...headers },
  }).then((response) => response);
}

const http = {
  ...instance,
  get,
  put,
  post,
  remove,
};

export default http;
