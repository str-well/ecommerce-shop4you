# E-commerce Shop4You - Arquitetura de Microfrontends

## 📋 Visão Geral

Este projeto implementa uma arquitetura moderna de microfrontends para um e-commerce, utilizando tecnologias de ponta e práticas recomendadas de desenvolvimento. A solução é composta por dois microfrontends principais: `store` e `cart`, cada um responsável por um domínio específico da aplicação.

## 🏗️ Arquitetura

### Microfrontends

- **Store (Porta 3000)**

  - Responsável pela exibição dos produtos e catálogo
  - Interface principal do e-commerce
  - Gerenciamento de estado global da aplicação

- **Cart (Porta 3001)**
  - Gerenciamento do carrinho de compras
  - Checkout e processo de finalização
  - Integração com o microfrontend store

## 🛠️ Stack Tecnológica

### Frontend

- **Next.js 13.2.4**

  - Framework React com SSR (Server-Side Rendering)
  - Otimização de performance e SEO
  - Sistema de roteamento avançado
  - Hot-reloading para desenvolvimento

- **React 18.2.0**
  - Hooks para gerenciamento de estado
  - Virtual DOM para renderização eficiente
  - Componentização e reusabilidade

### Estilização

- **Chakra UI (^2.5.2)**

  - Sistema de design consistente
  - Componentes acessíveis
  - Tematização flexível
  - Integração com Next.js via `@chakra-ui/next-js`

- **Tailwind CSS (^3.4.1)**
  - Utility-first CSS
  - Customização através de classes
  - Performance otimizada
  - Integração com PostCSS

### Gerenciamento de Estado

- **TanStack Query (^5.72.2)**
  - Gerenciamento de estado do servidor
  - Cache e invalidação automática
  - Otimização de performance
  - Suporte a real-time updates

### Containerização

- **Docker & Docker Compose**
  - Isolamento de ambientes
  - Configuração consistente
  - Hot-reload em desenvolvimento
  - Volumes para persistência

## 🔄 Comunicação entre Microfrontends

### Estratégia de Integração

1. **Remote Component Mounting**

   - Carregamento dinâmico de componentes React entre microfrontends
   - Uso de UMD (Universal Module Definition) para compatibilidade
   - Scripts carregados via `unpkg` para React e ReactDOM
   - Componentes remotos expostos via webpack

2. **Estado Local e Persistência**
   - `localStorage` para persistência do carrinho
   - `Context API` para gerenciamento de estado
   - Eventos personalizados para sincronização

### Implementação da Integração

```typescript
// Exemplo de montagem do componente remoto (cart)
const loadRemoteComponent = async () => {
  // Carrega as dependências necessárias
  await loadScript('https://unpkg.com/react@18.2.0/umd/react.development.js');
  await loadScript('https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js');
  await loadScript('http://localhost:3001/remoteEntry.js');

  // Monta o componente remoto
  if (containerRef.current && window.remoteCheckout?.mount) {
    window.remoteCheckout.mount(containerRef.current, {
      products: checkoutProducts,
      onFinish: handleFinish,
    });
  }
};
```

## 🌐 API e Integração

### Fake Store API

- **Endpoint Base**: `https://fakestoreapi.com`
- **Implementação**: Fetch API nativo
- **Endpoints Utilizados**:
  - `/products` - Catálogo de produtos
  - `/products/{id}` - Detalhes do produto
  - `/products/categories` - Categorias disponíveis
  - `/products/category/{name}` - Produtos por categoria

### Implementação da API

```typescript
// Exemplo de implementação usando Fetch API
const api = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Falha ao buscar produtos');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },
  // ... outros métodos
};
```

## 🛠️ Configuração dos Microfrontends

### Store (Porta 3000)

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@chakra-ui/next-js'],
  images: {
    domains: ['fakestoreapi.com', 'source.unsplash.com'],
  },
};
```

### Cart (Porta 3001)

```javascript
// webpack.config.js
module.exports = {
  output: {
    filename: 'remoteEntry.js',
    library: {
      type: 'umd',
      name: 'remoteCheckout',
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
```

## 📦 Dependências Principais

### Store

```json
{
  "dependencies": {
    "@chakra-ui/next-js": "^2.4.2",
    "@chakra-ui/react": "^2.5.2",
    "next": "13.2.4",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

### Cart

```json
{
  "dependencies": {
    "@chakra-ui/react": "^2.5.2",
    "next": "13.2.4",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

## 🔒 Segurança e CORS

### Configurações de CORS

```javascript
// cart/next.config.js
async headers() {
  return [{
    source: '/:path*',
    headers: [{
      key: 'Access-Control-Allow-Origin',
      value: '*'
    }]
  }];
}
```

## 🧪 Testes

### Cypress

- **Testes E2E**
  - Fluxos de navegação
  - Adição ao carrinho
  - Checkout
  - Integração entre microfrontends

### Configuração Cypress

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
  },
});
```

## 📈 Performance

- **Otimizações**:

  - Carregamento dinâmico de componentes
  - Code splitting automático do Next.js
  - Lazy loading de imagens
  - Caching de requisições da API
  - UMD para compartilhamento de dependências

- **Estratégias**:
  - Retry mechanism para carregamento de scripts
  - Fallbacks para componentes remotos
  - Persistência local de dados
  - Pré-carregamento de recursos críticos

## 🚀 Como Executar

### Requisitos

- Docker
- Docker Compose
- Node.js 18+

### Comandos

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar os serviços
docker-compose down

# Reconstruir as imagens
docker-compose build
```

## 📁 Estrutura de Diretórios

```
.
├── apps/
│   ├── store/              # Microfrontend da loja
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Rotas Next.js
│   │   └── package.json   # Dependências específicas
│   │
│   └── cart/              # Microfrontend do carrinho
│       ├── components/    # Componentes React
│       ├── pages/        # Rotas Next.js
│       └── package.json  # Dependências específicas
│
├── docker-compose.yml     # Configuração dos serviços
└── package.json          # Dependências compartilhadas
```

## ⚙️ Configurações

### Docker

- Volumes mapeados para hot-reload
- Portas expostas: 3000 (store) e 3001 (cart)
- Node.js Alpine para imagens leves
- Ambiente de desenvolvimento configurado

### Next.js

- Configuração de portas independentes
- Otimização de build
- Suporte a TypeScript
- Integração com ESLint

## 🎯 Decisões Técnicas

### Por que Next.js?

- SSR para melhor SEO
- Performance otimizada
- Roteamento avançado
- Grande ecossistema

### Por que Chakra UI + Tailwind?

- Componentes acessíveis prontos (Chakra)
- Flexibilidade de estilização (Tailwind)
- Melhor DX (Developer Experience)
- Manutenibilidade

### Por que TanStack Query?

- Gerenciamento eficiente de estado
- Cache inteligente
- Redução de boilerplate
- Suporte a tempo real

### Por que Docker?

- Ambiente consistente
- Facilidade de deploy
- Escalabilidade
- Isolamento

### Por que não Module Federation + Webpack 5?

Embora o Module Federation seja uma solução popular para microfrontends, optei por uma abordagem mais simples e direta por várias razões:

1. **Complexidade vs. Necessidade**
   - O Module Federation adiciona uma camada significativa de complexidade
   - Para nossa escala atual (2 microfrontends), seria uma solução muito robusta
   - A configuração e manutenção seriam mais complexas que o benefício oferecido

2. **Flexibilidade da Solução Atual**
   - Nossa implementação com UMD + Remote Component oferece:
     - Carregamento dinâmico eficiente
     - Controle total sobre o ciclo de vida dos componentes
     - Facilidade de debug e manutenção
     - Menor curva de aprendizado, fácil de implementar

3. **Performance**
   - A solução atual já oferece code splitting automático via Next.js
   - Carregamento sob demanda dos componentes remotos
   - Compartilhamento eficiente de dependências via CDN (unpkg)
   - Menor overhead de bundle size

4. **Simplicidade de Deploy**
   - Builds independentes para cada microfrontend
   - Processo de deploy mais direto e previsível
   - Menor risco de falhas em produção
   - Facilidade de rollback se necessário

## 📈 Performance

- Otimização de imagens Docker
- Code splitting automático
- Lazy loading de componentes
- Caching eficiente com TanStack Query
- Estratégias de cache no localStorage
- Compressão de assets
- Otimização de bundle size
- Prefetching de rotas principais

## 📚 Boas Práticas

- Clean Code
- SOLID Principles
- DRY (Don't Repeat Yourself)
- Conventional Commits


## 📄 Licença

Este projeto está sob a licença MIT.
