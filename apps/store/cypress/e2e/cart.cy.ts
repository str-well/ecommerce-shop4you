describe('Processo de Compra', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve completar o processo de checkout', () => {
    // Clica no produto
    cy.contains('Solid Gold Petite Micropave').click();

    // Clica no botão Comprar Agora
    cy.contains('Comprar Agora').click();

    // Verifica se foi redirecionado para a página de checkout
    cy.url().should('include', '/checkout');

    // Clica no botão Continuar
    cy.contains('Continuar').click();
    cy.wait(1000); // Espera a transição de tela

    // Preenche o formulário com os campos exatos da imagem
    cy.contains('CEP').type('04727-100');
    cy.contains('Rua').type('Rua Doutor Fritz Martin');
    cy.contains('Número').type('225');
    cy.contains('Complemento').type('N/A');
    cy.contains('Bairro').type('Vila Cruzeiro');
    cy.contains('Cidade').type('São Paulo');
    cy.contains('Estado').type('SP');

    // Clica no botão Continuar
    cy.contains('Continuar').click();
    cy.wait(1000); // Espera a transição de tela

    // Seleciona o cartão específico
    cy.contains('(Crédito) Mastercard terminando em 1779').click();

    // Clica no botão Finalizar
    cy.contains('Finalizar').click();

    // Verifica se aparece a mensagem de sucesso
    cy.contains('Pedido Realizado!').should('be.visible');
    cy.contains('Seu pedido foi finalizado com sucesso').should('be.visible');

    // Clica no botão de voltar para a loja
    cy.contains('Voltar para a Loja').click();
  });
});
