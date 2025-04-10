import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import RemoteCheckout from '../components/RemoteCheckout';
import { Layout } from '@/components/Layout';

export default function CheckoutPage() {
  return (
    <Layout>
      <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
        <Box>
          <RemoteCheckout />
        </Box>
      </Container>
    </Layout>
  );
}
