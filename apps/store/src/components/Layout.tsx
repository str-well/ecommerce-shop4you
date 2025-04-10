import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { CiFilter, CiMenuBurger, CiSearch, CiShoppingCart } from "react-icons/ci";
import { useCart } from '../contexts/CartContext';
import { CartDrawer } from './CartDrawer';
import { FilterDrawer } from './FilterDrawer';


interface LayoutProps {
  children: React.ReactNode;
}



export function Layout({ children }: LayoutProps) {
  const { items } = useCart();
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const headerBg = "#915a33";  // Cor marrom do header
  const { isOpen: isCartOpen, onOpen: onCartOpen, onClose: onCartClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose } = useDisclosure();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Detectar se estamos em um dispositivo móvel
  const isMobile = useBreakpointValue({ base: true, md: false });
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  // Atualiza o contador de itens sempre que o items mudar
  useEffect(() => {
    setCartCount(itemsCount);
  }, [itemsCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsSearchExpanded(false);
    }
  };

  const navigateToCategory = (category: string) => {
    router.push(`/category/${category}`);
    if (isMobileMenuOpen) {
      onMobileMenuClose();
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDir="column">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={10}
        bg={headerBg}
        color="white"
        py={{ base: 2, md: 2 }}
      >
        <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
          <Flex justify="space-between" align="center" mb={{ base: 1, md: 2 }} flexDir={{ base: "column", md: "row" }}>
            <Flex justify="space-between" align="center" w="100%">
              {/* Logo */}
              <Link href="/" passHref>
                <Heading
                  as="h1"
                  size={{ base: "lg", md: "2xl" }}
                  fontWeight="bold"
                  cursor="pointer"
                  color="white"
                  fontFamily={"sans-serif"}
                  textShadow="0px 2px 4px rgba(0, 0, 0, 0.4)"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={{ base: 0, md: 3 }}
                  mt={{ base: 0, md: 3 }}
                >
                  Shop4You
                </Heading>
              </Link>

              {/* Barra de pesquisa - visível apenas em desktop */}
              <Flex
                flex={1}
                mx={{ base: 2, md: 6 }}
                display={{ base: 'none', md: 'flex' }}
              >
                <form onSubmit={handleSearch} style={{ width: '100%' }}>
                  <InputGroup size={{ base: "sm", md: "md" }}>
                    <Input
                      placeholder="Buscar produtos..."
                      bg="white"
                      color="gray.800"
                      borderRadius="md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Buscar"
                        icon={<CiSearch />}
                        fontSize={{ base: "xl", md: "2xl" }}
                        variant="ghost"
                        colorScheme="gray"
                        type="submit"
                      />
                    </InputRightElement>
                  </InputGroup>
                </form>
              </Flex>

              {/* Ícones e botões do header */}
              <HStack spacing={{ base: 1, md: 2 }}>
                {/* Botão de busca em dispositivos móveis (quando não expandido) */}
                {!isSearchExpanded && (
                  <IconButton
                    aria-label="Buscar produtos"
                    icon={<CiSearch />}
                    fontSize="2xl"
                    variant="ghost"
                    color="white"
                    display={{ base: 'flex', md: 'none' }}
                    _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                    onClick={() => setIsSearchExpanded(true)}
                    ref={searchBtnRef}
                  />
                )}

                {/* Botão de filtro */}
                <IconButton
                  aria-label="Filtrar produtos"
                  icon={<CiFilter />}
                  fontSize={{ base: "xl", md: "2xl" }}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                  onClick={onFilterOpen}
                />

                {/* Botão do carrinho */}
                <Box position="relative">
                  <IconButton
                    aria-label="Carrinho de compras"
                    className="cart-icon"
                    icon={<CiShoppingCart />}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                    onClick={onCartOpen}
                  />
                  {cartCount > 0 && (
                    <Box
                      position="absolute"
                      top="-2"
                      right="-2"
                      bg="#d4a176"
                      color="white"
                      borderRadius="full"
                      minW={{ base: "5", md: "6" }}
                      h={{ base: "5", md: "6" }}
                      fontSize={{ base: "2xs", md: "xs" }}
                      fontWeight="bold"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="0 0 0 2px #915a33"
                      animation="pulse 1.5s infinite"
                      sx={{
                        "@keyframes pulse": {
                          "0%": {
                            transform: "scale(1)",
                          },
                          "50%": {
                            transform: "scale(1.1)",
                          },
                          "100%": {
                            transform: "scale(1)",
                          },
                        },
                      }}
                    >
                      {cartCount}
                    </Box>
                  )}
                </Box>

                {/* Botão do menu mobile */}
                <IconButton
                  aria-label="Menu"
                  icon={<CiMenuBurger />}
                  fontSize={{ base: "2xl", md: "3xl" }}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                  onClick={onMobileMenuOpen}
                  display={{ base: 'flex', md: 'none' }}
                />
              </HStack>
            </Flex>

            {/* Barra de pesquisa - visível apenas em mobile quando expandida */}
            {isSearchExpanded && (
              <Flex
                w="100%"
                mt={2}
                display={{ base: 'flex', md: 'none' }}
              >
                <form onSubmit={handleSearch} style={{ width: '100%' }}>
                  <InputGroup size="sm">
                    <Input
                      placeholder="Buscar produtos..."
                      bg="white"
                      color="gray.800"
                      borderRadius="md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Buscar"
                        icon={<CiSearch />}
                        fontSize="xl"
                        variant="ghost"
                        colorScheme="gray"
                        type="submit"
                      />
                    </InputRightElement>
                  </InputGroup>
                </form>
              </Flex>
            )}
          </Flex>

          {/* Menu de categorias - Versão desktop */}
          <Flex
            justify="flex-start"
            align="center"
            borderTop="1px solid"
            borderColor="rgba(255,255,255,0.2)"
            pt={2}
            display={{ base: 'none', md: 'flex' }}
          >
            <HStack spacing={4} overflowX="auto" className="hide-scrollbar" width="100%" py={1}>
              <Button
                variant="ghost"
                color="white"
                _hover={{ textDecoration: 'underline' }}
                fontWeight="normal"
                size="md"
                fontSize="1.1rem"
                onClick={() => router.push("/")}
                whiteSpace="nowrap"
              >
                Página Inicial
              </Button>
              <Button
                variant="ghost"
                color="white"
                _hover={{ textDecoration: 'underline' }}
                fontWeight="normal"
                size="md"
                fontSize="1.1rem"
                onClick={() => navigateToCategory("men's clothing")}
                whiteSpace="nowrap"
              >
                Masculino
              </Button>
              <Button
                variant="ghost"
                color="white"
                _hover={{ textDecoration: 'underline' }}
                fontWeight="normal"
                size="md"
                fontSize="1.1rem"
                onClick={() => navigateToCategory("women's clothing")}
                whiteSpace="nowrap"
              >
                Feminino
              </Button>
              <Button
                variant="ghost"
                color="white"
                _hover={{ textDecoration: 'underline' }}
                fontWeight="normal"
                size="md"
                fontSize="1.1rem"
                onClick={() => navigateToCategory("jewelery")}
                whiteSpace="nowrap"
              >
                Joias
              </Button>
              <Button
                variant="ghost"
                color="white"
                _hover={{ textDecoration: 'underline' }}
                fontWeight="normal"
                size="md"
                fontSize="1.1rem"
                onClick={() => navigateToCategory("electronics")}
                whiteSpace="nowrap"
              >
                Eletrônicos
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Menu de categorias - Versão mobile (Drawer) */}
      <Drawer
        isOpen={isMobileMenuOpen}
        placement="left"
        onClose={onMobileMenuClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color="#915a33" />
          <DrawerHeader borderBottomWidth="1px" color="#915a33">Menu</DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              <Button
                variant="ghost"
                justifyContent="flex-start"
                fontWeight="normal"
                py={6}
                borderBottomWidth="1px"
                borderColor="gray.100"
                borderRadius={0}
                onClick={() => {
                  router.push("/");
                  onMobileMenuClose();
                }}
              >
                Página Inicial
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                fontWeight="normal"
                py={6}
                borderBottomWidth="1px"
                borderColor="gray.100"
                borderRadius={0}
                onClick={() => navigateToCategory("men's clothing")}
              >
                Roupas Masculinas
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                fontWeight="normal"
                py={6}
                borderBottomWidth="1px"
                borderColor="gray.100"
                borderRadius={0}
                onClick={() => navigateToCategory("women's clothing")}
              >
                Roupas Femininas
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                fontWeight="normal"
                py={6}
                borderBottomWidth="1px"
                borderColor="gray.100"
                borderRadius={0}
                onClick={() => navigateToCategory("jewelery")}
              >
                Joias
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                fontWeight="normal"
                py={6}
                borderBottomWidth="1px"
                borderColor="gray.100"
                borderRadius={0}
                onClick={() => navigateToCategory("electronics")}
              >
                Eletrônicos
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box as="main" flex="1">
        <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 2, md: 4 }}>
          {children}
        </Container>
      </Box>

      <Box
        as="footer"
        bg={useColorModeValue('white', 'gray.800')}
        borderTop="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        py={{ base: 4, md: 8 }}
        px={{ base: 4, md: 0 }}
      >
        <Container maxW="container.xl">
          <Flex justify="center" align="center" flexDir={{ base: "column", md: "row" }} gap={{ base: 2, md: 0 }}>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} textAlign="center">
              © {new Date().getFullYear()} Shop4You. Todos os direitos reservados.
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Drawer do carrinho */}
      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />

      {/* Drawer de filtro */}
      <FilterDrawer isOpen={isFilterOpen} onClose={onFilterClose} />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Box>
  );
}
