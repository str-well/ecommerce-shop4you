import { QueryClient } from '@tanstack/react-query';
import { NextApiRequest, NextApiResponse } from 'next';

const queryClient = new QueryClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Retorna o carrinho atual
    const cart = JSON.parse(req.cookies.cart || '[]');
    res.status(200).json(cart);
  } else if (req.method === 'POST') {
    // Atualiza o carrinho
    const { items } = req.body;
    res.setHeader('Set-Cookie', `cart=${JSON.stringify(items)}; path=/`);
    res.status(200).json(items);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
