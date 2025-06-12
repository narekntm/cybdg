describe('User Management Suite', () => {
  beforeEach(() => {
    cy.log('Test is starting');
    cy.visit('http://127.0.0.1:5500/Resources/htmls/CSS/user_management.html');
  });

  it('Login as Admin', () => {
    cy.get('div#admin-controls').prev().should('have.text', 'Login as Admin');

    cy.get('label[for="admin-email"]').should('have.text', 'Email');

    cy.get('input#admin-email').should('have.attr', 'required');
    cy.get('input#admin-email')
      .should('be.visible')
      .and('be.enabled')
      .clear()
      .type('admin@example.com')
      .should('have.value', 'admin@example.com');

    cy.get('label[for="admin-password"]').should('have.text', 'Password');
    cy.get('input#admin-password').should('have.attr', 'required');

    cy.get('input#admin-password')
      .should('be.visible')
      .and('be.enabled')
      .clear()
      .type('admin123')
      .should('have.value', 'admin123');

    cy.get('form#user-form button.btn-primary[type="submit"]').should('have.text', 'Save');

    let email: string;
    let password: string;
    cy.get('input#admin-email').invoke('val').then((value) => {
      email = value as string;
    });
    cy.get('input#admin-password').invoke('val').then((value) => {
      password = value as string;
    }); 

    cy.get('form#admin-login-form button.btn-primary[type="submit"]')
      .click()
      .then(() => {
        if (email == 'admin@example.com' && password == 'admin123') {
          cy.get('div#admin-controls strong').should('have.text', 'You are logged in as admin.');
          //cy.get('button#logout-btn').should('have.text', 'Logout').click();
        } else {
          cy.get('#login-status').should('have.text', 'Invalid credentials');
        }
      });
  });

  it('User Management Test', () => {
    cy.get('section h2#form-title').should('have.text', 'Add New User');
    cy.get('label[for="name"]').should('have.text', 'Full Name');
    cy.get('input#name').should('have.attr', 'required');
    cy.get('input#name')
      .should('be.visible')
      .and('be.enabled')
      .clear()
      .type('LarisaYeremyan')
      .should('have.value', 'LarisaYeremyan');

    let userNameIsvalid = true;
    cy.get('input#name').invoke('val').then((value) => {
      if(!/^[A-Za-z]{1,20}$/.test(value as string)) {
        userNameIsvalid = false;
      }
    }); 

    cy.get('label[for="role"]').should('have.text', 'Role');
    cy.get('select#role').should('have.attr', 'required');
    cy.get('select#role')
    .should('be.visible')
    .and('be.enabled')
    .select('Editor')
    .find('option')
    .should('have.length', 4);
    
    let userRoleIsValid = true;
    cy.get('select#role').invoke('val').then((value) => {
      if(value == "") {
        userRoleIsValid = false;
      }
    });        

    cy.get('label[for="age"]').should('have.text', 'Age');
    cy.get('input#age')
      .should('be.visible')
      .and('be.enabled')
      .clear()
      .type('55')
      .should('have.value', '55');

    let userAgeIsValid = true;
    cy.get('input#age').invoke('val').then((value) => {
      if(value == "") {
        userAgeIsValid = false;
      }
    });   

    cy.get('label[for="email"]').should('have.text', 'Email');
    cy.get('input#email').should('have.attr', 'required');
    cy.get('input#email')
      .should('be.visible')
      .and('be.enabled')
      .clear()
      .type('larisayeremyan@gmail.com')
      .should('have.value', 'larisayeremyan@gmail.com');

    let userEmailIsValid = true;
    cy.get('input#email').invoke('val').then((email) => {
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string)) {
        userEmailIsValid = false;
      }
    });

    let userGenderIsValid = true;
    cy.get('input[value="Male"]')
      .parents('label')
      .parent()
      .siblings('label')
      .should('have.text', 'Gender');
    cy.get('input[value="Male"]').check().should('be.checked').invoke('val').then((value) => {
       if (value == undefined) {
          userGenderIsValid = false;
       }
    }); 

    cy.get('input[value="Newsletter"]')
      .parents('label')
      .parent()
      .siblings('label')
      .should('have.text', 'Subscribe to');
    cy.get('input[value="Newsletter"]').check().should('be.checked');
    cy.get('input[value="Product Updates"]').check().should('be.checked');

    let rowCount: number;
    cy.get('table#user-table tbody tr')
      .its('length')
      .then((count) => {
        rowCount = count;
      });
    cy.get('form#user-form button.btn-primary[type="submit"]').should('have.text', 'Save');
    cy.get('form#user-form button.btn-primary[type="submit"]')
    .click().then(() => {
        if (!userNameIsvalid) {
          cy.get('div#form-errors ul li:contains("Name must be 1–20 letters only (no spaces or symbols).")')
            .should('be.visible');          
        }

        if (!userRoleIsValid) {
          cy.get('div#form-errors ul li:contains("Role is required.")')
            .should('be.visible');          
        }        

        if (!userAgeIsValid) {
          cy.get('div#form-errors ul li:contains("Age must be between 1 and 99.")')
            .should('be.visible');          
        }   

        if (!userEmailIsValid) {
          cy.get('div#form-errors ul li:contains("Valid email is required.")')
            .should('be.visible');          
        } 

        if (!userGenderIsValid) {
          cy.get('div#form-errors ul li:contains("Gender selection is required.")')
            .should('be.visible');          
        }         

        if (userNameIsvalid && userRoleIsValid && userAgeIsValid && userEmailIsValid && userGenderIsValid)
        cy.get('table#user-table tbody tr')
          .its('length')
          .should('be.gt', rowCount)
      });
  });

  it('User Table', () => {
    cy.get('table#user-table tbody tr').should('have.length', 3);

    cy.get('table#user-table tr').first().find('th').should('have.length', 8);

    const expectedHeaders = ['Name', 'Role', 'Age', 'Email', 'Gender', 'Subscription', 'Status', 'Actions'];
    cy.get('table#user-table thead tr').first().find('th').each(($el, index) => {
        cy.wrap($el).should('have.text', expectedHeaders[index]);
    });

    cy.get('table#user-table tbody tr').each(($row) => {
        let firstName: string;
        cy.wrap($row).find('td').eq(0).invoke('text').then((tdText) => {
            firstName = tdText;
        });
        
        let role: string;        
        cy.wrap($row).find('td').eq(1).invoke('text').then((tdText) => {
            role = tdText;
        });
        
        let age: string;        
        cy.wrap($row).find('td').eq(2).invoke('text').then((tdText) => {
            age = tdText;
        }); 

        let email: string;
        cy.wrap($row).find('td').eq(3).invoke('text').then((tdText) => {
            email = tdText;
        }); 
        
        let gender: string;        
        cy.wrap($row).find('td').eq(4).invoke('text').then((tdText) => {
            gender = tdText;
        }); 

        let subscription: string[];
        cy.wrap($row).find('td').eq(5).invoke('text').then((text: string) => {
            subscription = text.split(',').map(v => v.trim());
        });        

        cy.wrap($row).find('td').find('button.edit-btn').should('have.text', 'Edit').should('be.visible').click().then(() => {
            cy.get('input#name').should('have.value', firstName);
            cy.get('select#role').should('have.value', role);
            cy.get('input#age').should('have.value', age);
            cy.get('input#email').should('have.value', email);
            cy.get(`input[value="${gender}"]`).should('be.checked');   
            
            subscription.forEach((value, index) => {
                cy.get(`input[value="${value}"]`).should('be.checked');
            });
        });

        let rowCount: number;
        cy.get('table#user-table tbody tr')
          .its('length')
          .then((count) => {
            rowCount = count;
        });        
        
        let status: string;
        cy.wrap($row).find('td').find('button.status-btn').invoke('text').then((text) => {
          status = text;
        });
        
        cy.wrap($row).find('td').find('button.status-btn').should('be.visible').click().then(() => {
          if (status == "Activate") {
            cy.wrap($row).find('td').find('button.status-btn').should('have.text', 'Deactivate');
          } else {
            cy.wrap($row).find('td').find('button.status-btn').should('have.text', 'Activate');
          }
        });
        
        cy.wrap($row).find('td').find('button.delete-btn').should('have.text', 'Delete').should('be.visible').click().then(() => {
          if (role = "Admin") {
            cy.get('div#admin-delete-error').should('have.text', 'Admin login required to delete Admin-level users.');
          } else {
            cy.get('table#user-table tbody tr').its('length').should('be.lt', rowCount);
          }
        });
    });    
  })
});