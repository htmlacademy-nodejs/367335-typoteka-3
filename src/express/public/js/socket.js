'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const socket = io(SERVER_URL);
  const articlesElement = document.querySelector(`.hot__list`);
  const commentsElement = document.querySelector(`.last__list`);

  socket.addEventListener(`update:popularArticles`, (articles) => {
    articlesElement.innerHTML = articles.map(({id, truncatedText, commentsCount}) => `
      <li class="hot__list-item">
        <a class="hot__list-link" href="/articles/${id}">
          ${truncatedText}
          <sup class="hot__link-sup">${commentsCount}</sup>
        </a>
      </li>
    `).join(``);
  });

  socket.addEventListener(`update:lastComments`, (comments) => {
    commentsElement.innerHTML = comments.map(({Users, ArticleId, truncatedText}) => `
      <li class="last__list-item">
        <img class="last__list-image" src="/img/${Users.avatar}" alt="Аватар пользователя" width="20" height="20">
        <b class="last__list-name">${Users.firstName} ${Users.lastName}</b>
        <a class="last__list-link" href="/articles/${ArticleId}">${truncatedText}</a>
      </li>
    `).join(``);
  });
})();
