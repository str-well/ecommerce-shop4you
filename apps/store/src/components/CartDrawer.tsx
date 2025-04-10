import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemsCount, removeItem, clearCart } = useCart();
  const router = useRouter();

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleFinishPurchase = () => {
    onClose();
    router.push('/checkout');
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: "full", md: "md" }}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton size="lg" color="#915a33" />
        <DrawerHeader
          borderBottomWidth="1px"
          py={{ base: 4, md: 6 }}
          fontSize={{ base: "lg", md: "xl" }}
          color="#915a33"
        >
          Carrinho de Compras ({itemsCount} itens)
        </DrawerHeader>

        <DrawerBody px={{ base: 2, md: 4 }} pt={4}>
          {items.length === 0 ? (
            <VStack spacing={6} justify="center" h="80%" align="center">
              <Text textAlign="center" fontSize={{ base: "md", md: "lg" }}>
                Seu carrinho está vazio
              </Text>
              <Button
                variant="outline"
                colorScheme="brown"
                borderColor="#915a33"
                color="#915a33"
                onClick={() => {
                  onClose();
                }}
                size={{ base: "md", md: "lg" }}
              >
                Continuar Comprando
              </Button>
            </VStack>
          ) : (
            <>
              <VStack spacing={0} align="stretch" divider={<Divider />} mb={6}>
                {items.map((item) => (
                  <Flex
                    key={item.id}
                    align="center"
                    justify="space-between"
                    py={4}
                    px={{ base: 1, md: 2 }}
                    gap={{ base: 2, md: 4 }}
                  >
                    <Box
                      position="relative"
                      minW={{ base: "60px", md: "80px" }}
                      h={{ base: "60px", md: "80px" }}
                      borderRadius="md"
                      overflow="hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        objectFit="contain"
                        boxSize="100%"
                      />
                    </Box>
                    <Box flex={1}>
                      <Text
                        fontWeight="medium"
                        fontSize={{ base: "sm", md: "md" }}
                        noOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <HStack fontSize={{ base: "xs", md: "sm" }} color="gray.600" mt={1}>
                        <Text>{formatPrice(item.price)}</Text>
                        <Text>×</Text>
                        <Text>{item.quantity}</Text>
                      </HStack>
                      <Text
                        fontWeight="bold"
                        color="#915a33"
                        fontSize={{ base: "sm", md: "md" }}
                        mt={1}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                    </Box>
                    <IconButton
                      aria-label="Remover item"
                      icon={<DeleteIcon />}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveItem(item.id)}
                      size={{ base: "sm", md: "md" }}
                    />
                  </Flex>
                ))}
              </VStack>

              <Box mt={4} position="sticky" bottom={0} bg="white" pt={2} pb={4}>
                <Flex
                  justify="space-between"
                  align="center"
                  mb={4}
                  borderTop="1px"
                  borderColor="gray.200"
                  pt={4}
                >
                  <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                    Total
                  </Text>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="bold"
                    color="#915a33"
                  >
                    {formatPrice(total)}
                  </Text>
                </Flex>

                <Button
                  colorScheme="red"
                  variant="outline"
                  width="full"
                  onClick={handleClearCart}
                  mb={4}
                  size={{ base: "md", md: "lg" }}
                >
                  Limpar Carrinho
                </Button>

                <Button
                  bg="#915a33"
                  color="white"
                  _hover={{ bg: "#A0522D" }}
                  width="full"
                  onClick={handleFinishPurchase}
                  size={{ base: "md", md: "lg" }}
                >
                  Finalizar Compra
                </Button>
              </Box>
            </>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
