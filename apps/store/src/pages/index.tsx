import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { api, Category, Product } from '../services/api';


// Animações e motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionButton = motion(Button);
const MotionHeading = motion(Heading);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

interface ArrowIconProps {
  direction: 'left' | 'right';
}

const ArrowIcon = ({ direction }: ArrowIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: direction === 'left' ? 'rotate(180deg)' : 'none' }}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// Dicionário de tradução para as categorias
const categoryTranslations: Record<string, string> = {
  "electronics": "Eletrônicos",
  "jewelery": "Joias",
  "men's clothing": "Roupas Masculinas",
  "women's clothing": "Roupas Femininas"
};



export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  // Responsividade
  const isMobile = useBreakpointValue({ base: true, md: false });
  const featuredColumns = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getLimitedProducts(20), // Aumentando para 20 produtos
          api.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Slider navigation para categorias
  const nextCategorySlide = () => {
    setCurrentCategorySlide((prev) =>
      prev === categories.length - 1 ? 0 : prev + 1
    );
  };

  const prevCategorySlide = () => {
    setCurrentCategorySlide((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  const formatCategoryName = (category: string) => {
    return categoryTranslations[category] ||
      category.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace("'s", '');
  };

  // Encontrar uma imagem representativa para a categoria a partir dos produtos
  const getCategoryImage = (categoryName: string): string => {
    // Encontra um produto dessa categoria para usar sua imagem
    const categoryProduct = products.find(product => product.category === categoryName);

    // Imagem padrão caso não encontre produto
    return categoryProduct?.image || 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg';
  };

  const handleCategoryClick = (categoryName: string) => {
    window.location.href = `/category/${categoryName}`;
  };

  const addToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Evita navegar para a página do produto

    // Adicionar produto ao carrinho usando o contexto
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const navigateToProduct = (productId: number) => {
    window.location.href = `/product/${productId}`;
  };

  if (loading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" color="#915a33" thickness="4px" speed="0.65s" />
        </Flex>
      </Layout>
    );
  }

  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.filter(p => p.rating.rate >= 4.0).slice(0, 8);

  return (
    <Layout>
      <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
        {/* Slider de Categorias */}
        <Box mb={{ base: 5, md: 10 }} position="relative">
          <Box
            position="relative"
            height={{ base: "180px", sm: "220px", md: "400px" }}
            mb={6}
            overflow="hidden"
            borderRadius="lg"
            boxShadow="xl"
          >
            <IconButton
              aria-label="Categoria anterior"
              icon={<ArrowIcon direction="left" />}
              position="absolute"
              left={{ base: 2, md: 4 }}
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              onClick={prevCategorySlide}
              color="#915a33"
              bg="white"
              _hover={{ bg: "white", transform: "translateY(-50%) scale(1.1)" }}
              borderRadius="full"
              boxShadow="lg"
              size={{ base: "sm", md: "lg" }}
              transition="all 0.3s ease"
            />

            <IconButton
              aria-label="Próxima categoria"
              icon={<ArrowIcon direction="right" />}
              position="absolute"
              right={{ base: 2, md: 4 }}
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
              onClick={nextCategorySlide}
              color="#915a33"
              bg="white"
              _hover={{ bg: "white", transform: "translateY(-50%) scale(1.1)" }}
              borderRadius="full"
              boxShadow="lg"
              size={{ base: "sm", md: "lg" }}
              transition="all 0.3s ease"
            />

            <MotionFlex
              animate={{ x: `-${currentCategorySlide * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              height="100%"
              width="100%"
            >
              {categories.map((category, index) => (
                <Box
                  key={category.name}
                  position="relative"
                  width="100%"
                  height="100%"
                  flexShrink={0}
                  cursor="pointer"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <Box position="relative" width="100%" height="100%" overflow="hidden">
                    <Image
                      src={getCategoryImage(category.name)}
                      alt={formatCategoryName(category.name)}
                      fill
                      style={{
                        objectFit: "contain",
                      }}
                      priority={index === 0}
                    />
                    <Box
                      position="absolute"
                      inset={0}
                      bgGradient="linear(to-b, rgba(0,0,0,0.2), rgba(0,0,0,0.7))"
                      zIndex={1}
                    />
                  </Box>

                  <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    zIndex={2}
                    p={{ base: 3, md: 6 }}
                  >
                    <MotionHeading
                      color="white"
                      fontSize={{ base: "xl", sm: "2xl", md: "4xl" }}
                      fontWeight="bold"
                      textShadow="0px 2px 8px rgba(0, 0, 0, 0.6)"
                      fontFamily="sans-serif"
                      textAlign="center"
                      mb={{ base: 2, md: 4 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      {formatCategoryName(category.name)}
                    </MotionHeading>

                    <MotionButton
                      bg="white"
                      color="#915a33"
                      _hover={{
                        bg: "#F5DEB3",
                        transform: "translateY(-5px)",
                        boxShadow: "xl"
                      }}
                      fontWeight="bold"
                      size={{ base: "xs", sm: "sm", md: "md" }}
                      px={{ base: 4, md: 8 }}
                      py={{ base: 1, md: 2 }}
                      borderRadius="full"
                      boxShadow="md"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      Explorar Coleção
                    </MotionButton>
                  </Flex>
                </Box>
              ))}
            </MotionFlex>
          </Box>

          {/* Indicadores de slide */}
          <Flex justify="center" mt={{ base: 2, md: 4 }} mb={{ base: 0, md: 2 }}>
            {categories.map((_, index) => (
              <Box
                key={index}
                h={{ base: "2", md: "3" }}
                w={index === currentCategorySlide ? { base: "8", md: "12" } : { base: "2", md: "3" }}
                borderRadius="full"
                bg={index === currentCategorySlide ? "#915a33" : "gray.300"}
                mx={1}
                transition="all 0.4s ease"
                onClick={() => setCurrentCategorySlide(index)}
                cursor="pointer"
                _hover={{ bg: index === currentCategorySlide ? "#915a33" : "gray.400" }}
              />
            ))}
          </Flex>
        </Box>

        {/* Ofertas do Dia */}
        <Box mb={{ base: 8, md: 16 }}>
          <Flex justify="space-between" align="center" mb={{ base: 4, md: 8 }}>
            <Heading
              as="h2"
              fontSize={{ base: "lg", md: "2xl" }}
              fontWeight="bold"
              color="#333"
              fontFamily="sans-serif"
              position="relative"
              _after={{
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                width: { base: '40px', md: '60px' },
                height: { base: '2px', md: '3px' },
                bg: '#915a33',
                borderRadius: 'full'
              }}
            >
              Ofertas do Dia
            </Heading>
          </Flex>

          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={{ base: 3, sm: 4, md: 6 }}
          >
            {products.slice(0, featuredColumns && featuredColumns > 0 ? featuredColumns * 2 : 10).map((product) => (
              <MotionBox
                key={product.id}
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                boxShadow="md"
                whileHover={{
                  y: -8,
                  boxShadow: "lg",
                  transition: { duration: 0.3 }
                }}
                onClick={() => navigateToProduct(product.id)}
                cursor="pointer"
                position="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badge de desconto */}
                <Badge
                  position="absolute"
                  top={2}
                  left={2}
                  bg="#E53E3E"
                  color="white"
                  fontSize={{ base: "2xs", md: "xs" }}
                  fontWeight="bold"
                  borderRadius="full"
                  px={{ base: 2, md: 3 }}
                  py={{ base: 0.5, md: 1 }}
                  zIndex={1}
                  boxShadow="md"
                  transform="rotate(-5deg)"
                >
                  -{Math.floor(Math.random() * 30 + 10)}%
                </Badge>

                <Box
                  position="relative"
                  h={{ base: "120px", sm: "160px", md: "200px" }}
                  bg="gray.50"
                  overflow="hidden"
                >
                  <Box
                    position="relative"
                    width="100%"
                    height="100%"
                    p={3}
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: "scale(1.1)" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      style={{
                        objectFit: "contain",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  </Box>
                </Box>

                <Box p={{ base: 2, sm: 3, md: 4 }} bg="white">
                  <Text
                    fontSize={{ base: "2xs", sm: "xs", md: "xs" }}
                    color="gray.500"
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {formatCategoryName(product.category)}
                  </Text>

                  <Text
                    fontSize={{ base: "xs", sm: "sm", md: "sm" }}
                    fontWeight="semibold"
                    noOfLines={2}
                    lineHeight="tight"
                    mb={{ base: 1, md: 3 }}
                    color="gray.800"
                    minH={{ base: "32px", sm: "36px", md: "40px" }}
                  >
                    {product.title}
                  </Text>

                  <Flex align="center" mb={1} display={{ base: "none", sm: "flex" }}>
                    <Flex color="yellow.400">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          as={StarIcon}
                          boxSize={{ base: 2, md: 3 }}
                          opacity={i < Math.floor(product.rating.rate) ? 1 : 0.3}
                        />
                      ))}
                    </Flex>
                    <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" ml={1}>
                      ({product.rating.count})
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center" mt={{ base: 1, md: 3 }}>
                    <Box>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "xs" }} color="gray.500" textDecoration="line-through">
                        R$ {(product.price * 1.3).toFixed(2)}
                      </Text>
                      <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} fontWeight="bold" color="#915a33">
                        R$ {product.price.toFixed(2)}
                      </Text>
                    </Box>
                  </Flex>

                  <Text fontSize={{ base: "2xs", sm: "xs", md: "xs" }} color="green.600" mt={1} fontWeight="medium" display={{ base: "none", sm: "block" }}>
                    Em até 10x de R$ {(product.price / 10).toFixed(2)}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </Grid>
        </Box>

        {/* Os mais vendidos */}
        <Box mb={{ base: 8, md: 16 }}>
          <Flex justify="space-between" align="center" mb={{ base: 4, md: 8 }}>
            <Heading
              as="h2"
              fontSize={{ base: "lg", md: "2xl" }}
              fontWeight="bold"
              color="#333"
              fontFamily="sans-serif"
              position="relative"
              _after={{
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '0',
                width: { base: '40px', md: '60px' },
                height: { base: '2px', md: '3px' },
                bg: '#915a33',
                borderRadius: 'full'
              }}
            >
              Os mais vendidos
            </Heading>
          </Flex>

          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            gap={{ base: 3, sm: 4, md: 6 }}
          >
            {bestSellers.map((product) => (
              <MotionBox
                key={product.id}
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                boxShadow="md"
                whileHover={{
                  y: -8,
                  boxShadow: "lg",
                  transition: { duration: 0.3 }
                }}
                onClick={() => navigateToProduct(product.id)}
                cursor="pointer"
                position="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badge best seller */}
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  bg="#ED8936"
                  color="white"
                  fontSize={{ base: "2xs", md: "xs" }}
                  fontWeight="bold"
                  borderRadius="full"
                  px={{ base: 2, md: 3 }}
                  py={{ base: 0.5, md: 1 }}
                  zIndex={1}
                  boxShadow="md"
                  transform="rotate(5deg)"
                >
                  Best Seller
                </Badge>

                <Box
                  position="relative"
                  h={{ base: "120px", sm: "160px", md: "200px" }}
                  bg="gray.50"
                  overflow="hidden"
                >
                  <Box
                    position="relative"
                    width="100%"
                    height="100%"
                    p={3}
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: "scale(1.1)" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      style={{
                        objectFit: "contain",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  </Box>
                </Box>

                <Box p={{ base: 2, sm: 3, md: 4 }} bg="white">
                  <Text
                    fontSize={{ base: "2xs", sm: "xs", md: "xs" }}
                    color="gray.500"
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {formatCategoryName(product.category)}
                  </Text>

                  <Text
                    fontSize={{ base: "xs", sm: "sm", md: "sm" }}
                    fontWeight="semibold"
                    noOfLines={2}
                    lineHeight="tight"
                    mb={{ base: 1, md: 3 }}
                    color="gray.800"
                    minH={{ base: "32px", sm: "36px", md: "40px" }}
                  >
                    {product.title}
                  </Text>

                  <Flex align="center" mb={1} display={{ base: "none", sm: "flex" }}>
                    <Flex color="yellow.400">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          as={StarIcon}
                          boxSize={{ base: 2, md: 3 }}
                          opacity={i < Math.floor(product.rating.rate) ? 1 : 0.3}
                        />
                      ))}
                    </Flex>
                    <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" ml={1}>
                      ({product.rating.count})
                    </Text>
                  </Flex>

                  <Flex justify="space-between" align="center" mt={{ base: 1, md: 3 }}>
                    <Box>
                      <Text fontSize={{ base: "2xs", sm: "xs", md: "xs" }} color="gray.500" textDecoration="line-through">
                        R$ {(product.price * 1.3).toFixed(2)}
                      </Text>
                      <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} fontWeight="bold" color="#915a33">
                        R$ {product.price.toFixed(2)}
                      </Text>
                    </Box>
                  </Flex>

                  <Text fontSize={{ base: "2xs", sm: "xs", md: "xs" }} color="green.600" mt={1} fontWeight="medium" display={{ base: "none", sm: "block" }}>
                    Em até 10x de R$ {(product.price / 10).toFixed(2)}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </Grid>
        </Box>

        {/* Banner de Newsletter */}
        <MotionBox
          mb={{ base: 8, md: 16 }}
          bgGradient="linear(to-r, #915a33, #A0522D)"
          borderRadius="lg"
          p={{ base: 5, md: 12 }}
          color="white"
          textAlign="center"
          boxShadow="xl"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0.8, y: 20 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Heading
            as="h2"
            fontSize={{ base: "xl", md: "3xl" }}
            mb={{ base: 2, md: 4 }}
            fontWeight="bold"
            color="white"
            fontFamily="sans-serif"
          >
            Cadastre-se e Economize
          </Heading>
          <Text mb={{ base: 4, md: 6 }} maxW="xl" mx="auto" fontSize={{ base: "sm", md: "lg" }}>
            Receba ofertas exclusivas e cupons de desconto diretamente no seu e-mail
          </Text>
          <Flex
            maxW="md"
            mx="auto"
            bg="white"
            borderRadius={{ base: "md", sm: "full" }}
            overflow="hidden"
            flexDir={{ base: "column", sm: "row" }}
            boxShadow="lg"
          >
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="w-full px-6 py-3 outline-none text-gray-800"
              style={{ flex: 1, fontSize: 'inherit', padding: '10px 16px' }}
            />
            <Button
              bg="#F5DEB3"
              color="#915a33"
              _hover={{ bg: "#F5DEB3", boxShadow: "inner" }}
              h={'auto'}
              px={{ base: 4, md: 8 }}
              fontWeight="bold"
              size={{ base: "sm", md: "lg" }}
              borderRadius={{ base: 0, sm: "full" }}
              borderTopLeftRadius={{ base: 0, sm: 0 }}
              borderBottomLeftRadius={{ base: 0, sm: 0 }}
            >
              CADASTRAR
            </Button>
          </Flex>
        </MotionBox>

        {/* Vantagens */}
        <Box
          bg="white"
          borderRadius="lg"
          mb={{ base: 6, md: 16 }}
          p={{ base: 4, md: 8 }}
          boxShadow="md"
        >
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap={{ base: 4, md: 6 }}
          >
            {[
              {
                icon: "🚚",
                title: "Frete Grátis",
                description: "Acima de R$299"
              },
              {
                icon: "💳",
                title: "10x sem juros",
                description: "Parcele suas compras"
              },
              {
                icon: "🔄",
                title: "Troca grátis",
                description: "Primeira troca grátis"
              },
              {
                icon: "🔒",
                title: "Compra segura",
                description: "Site 100% seguro"
              }
            ].map((benefit, index) => (
              <MotionBox
                key={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Flex align="center" p={{ base: 1, md: 2 }}>
                  <Box
                    fontSize={{ base: "2xl", md: "3xl" }}
                    mr={{ base: 2, md: 4 }}
                    bg="#FCF5E9"
                    borderRadius="full"
                    p={{ base: 2, md: 3 }}
                    color="#915a33"
                  >
                    <Text>{benefit.icon}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize={{ base: "xs", md: "md" }}>
                      {benefit.title}
                    </Text>
                    <Text fontSize={{ base: "2xs", md: "sm" }} color="gray.600">
                      {benefit.description}
                    </Text>
                  </Box>
                </Flex>
              </MotionBox>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}
