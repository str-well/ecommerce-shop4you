import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const CART_QUERY_KEY = 'cart';

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cart = [] } = useQuery({
    queryKey: [CART_QUERY_KEY],
    queryFn: async () => {
      const response = await fetch('/api/cart');
      return response.json();
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async (items: any[]) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },
  });

  return {
    cart,
    updateCart: updateCartMutation.mutate,
  };
}
