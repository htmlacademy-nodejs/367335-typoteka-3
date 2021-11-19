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

  getArticles({isPopular, offset, limit, comments, CategoryId} = {}) {
    return this._load(`/articles`, {params: {isPopular, offset, limit, comments, CategoryId}});
  }

  getArticle({id, comments = 0}) {
    return this._load(`/articles/${id}`, {params: {comments}});
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

  dropArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  getCategories(count = 0) {
    return this._load(`/categories`, {params: {count}});
  }

  createCategory(title) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data: {title}
    });
  }

  updateCategory(id, title) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data: {title}
    });
  }

  dropCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  getComments({isPopular, limit} = {}) {
    return this._load(`/comments`, {params: {isPopular, limit}});
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  dropComment(articleId, commentId) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE
    });
  }

  search(query = ``) {
    return this._load(`/search`, {params: {query}});
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  createUser(data) {
    return this._load(`/user`, {
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
