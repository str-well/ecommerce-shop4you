import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  VStack
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { StarIcon } from '../../components/Icons';
import { Layout } from '../../components/Layout';
import { useCart } from '../../contexts/CartContext';
import { api, Product } from '../../services/api';

// Item de carrinho
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (id) {
      // Carregar dados do produto
      setLoading(true);
      api.getProduct(Number(id))
        .then((data) => {
          if (data) {
            setProduct(data);

            // Buscar produtos similares da mesma categoria
            if (data.category) {
              api.getProductsByCategory(data.category)
                .then((categoryProducts) => {
                  // Filtrar para remover o produto atual e limitar a 4 produtos
                  const similar = categoryProducts
                    .filter(p => p.id !== data.id)
                    .slice(0, 4);
                  setSimilarProducts(similar);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
            } else {
              setLoading(false);
            }
          } else {
            console.error(`Erro ao buscar produto com ID ${id}:`);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(`Erro ao buscar produto com ID ${id}:`, error);
          setLoading(false);
        });
    }
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    try {
      // Adicionar ao carrinho usando o contexto
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
    }
  };

  const buyNow = () => {
    if (!product) return;

    try {
      // Adicionar ao carrinho usando o contexto
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity
      });

      // Redirecionar para o checkout
      router.push('/checkout');
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" color="#915a33" thickness="4px" />
        </Flex>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Flex flexDir="column" align="center" justify="center" minH="50vh" gap={4}>
          <Box textAlign="center">
            <Heading size="md" mb={2}>Produto não encontrado</Heading>
            <Text color="gray.600">O produto que você está procurando não existe ou foi removido.</Text>
          </Box>
          <Button
            bg="#915a33"
            color="white"
            _hover={{ bg: "#A0522D" }}
            onClick={() => router.push('/')}
          >
            Voltar para a Página Inicial
          </Button>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={{ base: 4, md: 8 }} px={{ base: 3, md: 8 }}>
        {/* Breadcrumb na versão mobile */}
        <Box display={{ base: 'block', md: 'none' }} mb={4} overflow="hidden" whiteSpace="nowrap">
          <HStack spacing={2} fontSize="xs" color="gray.500" overflow="auto" className="hide-scrollbar" pb={1}>
            <Link href="/" passHref>
              <Text _hover={{ color: "#915a33" }}>Home</Text>
            </Link>
            <Text>›</Text>
            <Link href={`/category/${product.category}`} passHref>
              <Text _hover={{ color: "#915a33" }}>{formatCategoryName(product.category)}</Text>
            </Link>
            <Text>›</Text>
            <Text noOfLines={1} maxW="150px">{product.title}</Text>
          </HStack>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={{ base: 4, md: 8, lg: 12 }}
        >
          {/* Imagem do Produto */}
          <Box
            bg="white"
            borderRadius="lg"
            p={{ base: 3, md: 6 }}
            boxShadow="sm"
            mb={{ base: 4, md: 0 }}
          >
            <Box
              position="relative"
              height={{ base: "260px", sm: "300px", md: "400px", lg: "500px" }}
              width="100%"
            >
              <Image
                src={product.image}
                alt={product.title}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 80vw, 50vw"
                priority
              />
            </Box>
          </Box>

          {/* Detalhes do Produto */}
          <VStack align="stretch" spacing={{ base: 3, md: 5 }}>
            {/* Breadcrumb na versão desktop */}
            <Box display={{ base: 'none', md: 'block' }}>
              <HStack spacing={2} fontSize="sm" color="gray.500">
                <Link href="/" passHref>
                  <Text _hover={{ color: "#915a33" }}>Home</Text>
                </Link>
                <Text>›</Text>
                <Link href={`/category/${product.category}`} passHref>
                  <Text _hover={{ color: "#915a33" }}>{formatCategoryName(product.category)}</Text>
                </Link>
                <Text>›</Text>
                <Text noOfLines={1} maxW="300px">{product.title}</Text>
              </HStack>
            </Box>

            <Badge
              width="fit-content"
              bg="#915a33"
              color="white"
              opacity={0.8}
              borderRadius="sm"
              fontSize={{ base: "xs", md: "sm" }}
              textTransform="capitalize"
            >
              {formatCategoryName(product.category)}
            </Badge>

            <Heading
              as="h1"
              fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
              color="#333"
              lineHeight="1.3"
            >
              {product.title}
            </Heading>

            <HStack spacing={2}>
              <Flex color="yellow.400" align="center">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    as={StarIcon}
                    boxSize={{ base: 3, md: 4 }}
                    color={i < Math.floor(product.rating.rate) ? "yellow.400" : "gray.300"}
                    mr={0.5}
                  />
                ))}
              </Flex>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                {product.rating.rate} ({product.rating.count} avaliações)
              </Text>
            </HStack>

            <Box>
              <Text
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                fontWeight="bold"
                color="#915a33"
              >
                R$ {product.price.toFixed(2)}
              </Text>

              <Text fontSize={{ base: "xs", md: "sm" }} color="green.600" fontWeight="medium">
                Em até 10x de R$ {(product.price / 10).toFixed(2)} sem juros
              </Text>
            </Box>

            <Divider />

            <Text
              color="gray.700"
              fontSize={{ base: "sm", md: "md" }}
              lineHeight="1.6"
            >
              {product.description}
            </Text>

            <Divider />

            <Box>
              <Text mb={{ base: 1, md: 2 }} fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                Quantidade:
              </Text>
              <Flex maxW={{ base: "120px", md: "150px" }}>
                <NumberInput
                  value={quantity}
                  min={1}
                  max={10}
                  onChange={(_, value) => setQuantity(value)}
                  size={{ base: "sm", md: "md" }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </Box>

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: 2, md: 4 }}
              mt={{ base: 2, md: 4 }}
              w="100%"
            >
              <Button
                bg="white"
                border="1px"
                borderColor="#915a33"
                color="#915a33"
                size={{ base: "md", md: "lg" }}
                flex="1"
                _hover={{ bg: "gray.50" }}
                onClick={addToCart}
                py={{ base: 5, md: 6 }}
              >
                Adicionar ao Carrinho
              </Button>

              <Button
                bg="#915a33"
                color="white"
                size={{ base: "md", md: "lg" }}
                flex="1"
                _hover={{ bg: "#A0522D" }}
                onClick={buyNow}
                py={{ base: 5, md: 6 }}
              >
                Comprar Agora
              </Button>
            </Stack>

            {/* Promoções e Informações Adicionais */}
            <Box
              bg="gray.50"
              borderRadius="md"
              p={{ base: 3, md: 4 }}
              mt={{ base: 2, md: 4 }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              <VStack align="stretch" spacing={{ base: 2, md: 3 }}>
                <HStack>
                  <Box color="#915a33" fontSize={{ base: "lg", md: "xl" }}>🚚</Box>
                  <Text>Frete grátis em compras acima de R$ 299</Text>
                </HStack>
                <HStack>
                  <Box color="#915a33" fontSize={{ base: "lg", md: "xl" }}>🔄</Box>
                  <Text>30 dias para troca ou devolução</Text>
                </HStack>
                <HStack>
                  <Box color="#915a33" fontSize={{ base: "lg", md: "xl" }}>💳</Box>
                  <Text>Parcele em até 10x sem juros</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Grid>

        {/* Produtos similares */}
        {similarProducts.length > 0 && (
          <Box mt={{ base: 8, md: 16 }}>
            <Heading
              as="h2"
              size={{ base: "md", md: "lg" }}
              mb={{ base: 4, md: 6 }}
              color="#333"
            >
              Produtos Similares
            </Heading>

            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)"
              }}
              gap={{ base: 3, md: 6 }}
            >
              {similarProducts.map((product) => (
                <Box
                  key={product.id}
                  as="a"
                  href={`/product/${product.id}`}
                  bg="white"
                  borderRadius="md"
                  overflow="hidden"
                  boxShadow="sm"
                  transition="transform 0.3s, box-shadow 0.3s"
                  _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
                  h="100%"
                >
                  <Box position="relative" height={{ base: "120px", sm: "150px", md: "200px" }}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      style={{ objectFit: "contain", padding: "16px" }}
                    />
                  </Box>

                  <Box p={{ base: 2, md: 4 }}>
                    <Text
                      fontWeight="medium"
                      noOfLines={2}
                      fontSize={{ base: "xs", md: "sm" }}
                      minH={{ base: "32px", md: "40px" }}
                      mb={{ base: 1, md: 2 }}
                    >
                      {product.title}
                    </Text>

                    <Text
                      fontWeight="bold"
                      color="#915a33"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      R$ {product.price.toFixed(2)}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </Container>
    </Layout>
  );
}

// Função para formatação de nome de categoria
function formatCategoryName(category: string) {
  // Traduções específicas para português
  const translations: Record<string, string> = {
    "men's clothing": "Roupas Masculinas",
    "women's clothing": "Roupas Femininas",
    "jewelery": "Joias",
    "electronics": "Eletrônicos"
  };

  return translations[category] ||
    category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace("'s", '');
}
