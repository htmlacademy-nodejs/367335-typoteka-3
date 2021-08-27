'use strict';

const axios = require(`axios`);
const {DEFAULT_API_PORT, HttpMethod} = require(`../constants`);

const TIMEOUT = 10000;
const port = process.env.API_PORT || DEFAULT_API_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const {data} = await this._http.request({url, ...options});
    return data;
  }

  getArticles({offset, limit, comments} = {}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticle({id, comments = 0}) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query = ``) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count = false) {
    return this._load(`/categories`, {params: {count}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  updateArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }
}

const defaultApi = new API(defaultUrl, TIMEOUT);
module.exports = {
  API,
  getAPI: () => defaultApi
};
