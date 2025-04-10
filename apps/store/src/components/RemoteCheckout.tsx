import { useEffect, useRef, useState, useCallback } from 'react';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

declare global {
  interface Window {
    remoteCheckout?: {
      mount: (container: HTMLElement, options: {
        products: any[];
        onFinish?: () => void;
      }) => () => void;
    };
  }
}

// Componente que só será renderizado no cliente
const RemoteCheckout = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const { items, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFinish = useCallback(() => {
    try {
      // Limpar o carrinho
      clearCart();
      localStorage.removeItem('cart');

      // Redirecionar
      window.location.href = 'http://localhost:3000/checkout/success';
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Ocorreu um erro ao finalizar a compra. Por favor, tente novamente.');
    }
  }, [clearCart]);

  useEffect(() => {
    if (!isClient) return;

    const loadScript = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve();
        script.onerror = (error) => {
          console.error('Erro ao carregar script:', url, error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    };

    const loadRemoteComponent = async () => {
      try {
        // Carregar React e ReactDOM primeiro
        await loadScript('https://unpkg.com/react@18.2.0/umd/react.development.js');
        await loadScript('https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js');

        // Depois carregar o componente com retry
        const maxRetries = 3;
        let retries = 0;

        while (retries < maxRetries) {
          try {
            await loadScript('http://localhost:3001/remoteEntry.js');
            break;
          } catch (error) {
            retries++;
            if (retries === maxRetries) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (containerRef.current && window.remoteCheckout?.mount) {
          const checkoutProducts = items.map(item => ({
            id: typeof item.id === 'number' ? item.id.toString() : item.id,
            name: item.title || 'Produto sem nome',
            price: item.price,
            quantity: item.quantity,
            image: item.image || 'https://via.placeholder.com/150',
            seller: 'Shop4You'
          }));

          console.log('Montando componente remoto com produtos:', checkoutProducts);

          const mountOptions = {
            products: checkoutProducts,
            onFinish: () => {
              console.log('Finalizando compra...');
              handleFinish();
            }
          };

          cleanupRef.current = window.remoteCheckout.mount(containerRef.current, mountOptions);
        }
      } catch (error) {
        console.error('Erro ao carregar componente remoto:', error);
      }
    };

    if (items.length > 0) {
      loadRemoteComponent();
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      const scripts = document.querySelectorAll('script[crossorigin="anonymous"]');
      scripts.forEach(script => script.remove());
    };
  }, [items, handleFinish, isClient]);

  if (!isClient) {
    return <div>Carregando checkout...</div>;
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Seu carrinho está vazio</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '500px',
        width: '100%',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '16px'
      }}
    />
  );
};

// Exportar o componente com carregamento dinâmico
export default dynamic(() => Promise.resolve(RemoteCheckout), {
  ssr: false
});
