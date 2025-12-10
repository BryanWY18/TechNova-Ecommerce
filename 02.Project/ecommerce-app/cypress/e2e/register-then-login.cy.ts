describe('Register, login and add to cart', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should create an user 201, login, check products and add to cart', () => {
    cy.intercept('POST', '**/api/auth/register').as('registerRequest');
    cy.intercept('POST', '**/api/auth/login').as('logingRequest');
    cy.intercept('GET', '**/api/products*').as('getProducts');
    cy.intercept('POST', '**/api/cart/add-product*').as('addToCart');
    cy.intercept('GET', '**/api/cart/user/**').as('getCart');

    const timestamp = Date.now();
    const emailTest = `cypress${timestamp}@example.com`;
    const passwordTest = 'Test12345!';

    cy.visit('/register');

    cy.get('#displayName').type(`cypress ${timestamp}`);
    // cy.get('input[placeholder="Darktortilla"]')
    cy.get('#dateOfBirth').type('1990-01-01');
    cy.get('#email').type(emailTest);
    cy.get('#phone').type('1234567890');
    cy.get('#password').type(passwordTest);
    cy.get('#repeatPassword').type(passwordTest);

    // cy.get('input[placeholder="*******"]').eq(0).type(passwordTest);
    // cy.get('input[placeholder="*******"]').eq(1).type(passwordTest);

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response!.statusCode).to.equal(201);
    });

    cy.visit('/login');

    cy.get('input[type="email"]').type(emailTest);
    cy.get('#password').type(passwordTest);

    cy.get('button[type="submit"]').click();

    cy.wait('@logingRequest', { timeout: 10000 }).then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response!.statusCode).to.equal(200);
    });

    cy.url({ timeout: 10000 }).should('not.include', '/login');
    cy.window().then(win=>{
        const token = win.localStorage.getItem('token');
        expect(token).to.not.be.null;
    });

    cy.visit('/products');

    cy.wait('@getProducts', { timeout: 10000 });

    cy.get('[data-cy="product-card"]', { timeout: 10000 })
      .should('have.length.at.least', 1)
      .first()
      .as('firstProduct');

    cy.get('@firstProduct').find('[data-cy="add-to-cart-btn"]').click();
    cy.wait('@addToCart', { timeout: 10000 }).then((interception) => {
      expect(interception.response).not.to.be.undefined;
      expect(interception.response!.statusCode).to.equal(200);
    
    cy.wait('@getCart', { timeout: 10000 });
    });


  });
});
