//ингредиенты из моковых данных 
const main = 'Биокотлета из марсианской Магнолии';
const bun = 'Краторная булка N-200i';
const sauce = 'Соус Spicy-X';

// текстовое содержание для тестов 
const addButton = 'Добавить'; 
const detailsText = 'Детали ингредиента';

beforeEach(() => {
  window.localStorage.setItem('accessToken', 'token');
  // перехват запросов
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
  cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('getOrder');
  cy.visit('http://localhost:4000/');
  cy.wait('@getIngredients'); // завершения запроса на ингредиенты
});

// удаление токена и очищение локального хранилища с куки после каждого теста 
afterEach(() => {
  window.localStorage.removeItem('accessToken');
  cy.clearCookies();
  cy.clearLocalStorage();
});


describe('Проверка функциональности конструктора', () => {
  it('Добавление ингредиента', () => {
    cy.get(`li:contains(${bun})`).within(() => {
      cy.get(`button:contains(${addButton})`).click(); 
    });
    cy.get(`li:contains(${sauce})`).within(() => {
      cy.get(`button:contains(${addButton})`).click(); 
    });
    cy.get(`li:contains(${main})`).within(() => {
      cy.get(`button:contains(${addButton})`).click(); 
    });
    cy.get('[data-cy=burger-constructor]').contains(bun).should('exist');
    cy.get('[data-cy=burger-ingredients]').contains(sauce).should('exist');
    cy.get('[data-cy=burger-ingredients]').contains(main).should('exist');
  });
});

describe('Проверка модального окна', () => {
  it('Модальное окно открывается', () => {
    cy.contains(detailsText).should('not.exist');
    cy.contains(bun).click(); 
    cy.contains(detailsText).should('exist');
  });

  it('Модальное окно закрывается', () => {
    cy.contains(bun).click(); 
    cy.contains(detailsText).should('exist');
    cy.get('[data-cy=modal-close]').click();
    cy.contains(detailsText).should('not.exist');
  });
  it('Модальное окно закрывается по клику на оверлей', () => {
    cy.contains(bun).click(); 
    cy.contains(detailsText).should('exist');
    cy.get('[data-cy=modal-overlay]').click({ force: true }); // принудительно выполняем действие из-за нестыковки элементов
    cy.contains(detailsText).should('not.exist');
  });
});

describe('Проверка оформления заказа', () => {
  it('Процесс оформления заказа после авторизации пользователя', () => {
    cy.setCookie('accessToken', 'token');
    cy.wait('@getUser'); // завершения запроса на пользовательские данные 
    cy.wait('@getIngredients'); // завершения запроса на ингредиенты
    cy.get('[data-order-button]').should('exist');
    cy.get('[data-cy="bun"]:first-of-type button').click();
    cy.get('[data-cy="main"]:first-of-type button').click();
    cy.get('[data-order-button]').click();
    cy.get('[data-cy=burger-constructor]').within(() => {
      cy.contains(main).should('not.exist');
      cy.contains(main).should(
        'not.exist'
      );
      cy.contains(sauce).should('not.exist');
    });
  });
});