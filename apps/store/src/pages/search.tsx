import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Checkbox,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { Layout } from '../components/Layout';
import { api, Product } from '../services/api';


export default function SearchPage() {
  const router = useRouter();
  const { q: searchQuery, category, sort } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(sort as string || 'relevantes');

  const [onSale, setOnSale] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState('');
  const [minReviews, setMinReviews] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let allProducts = await api.getProducts();

        // Filtrar por termo de busca
        if (searchQuery) {
          allProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes((searchQuery as string).toLowerCase()) ||
            product.description.toLowerCase().includes((searchQuery as string).toLowerCase())
          );
        }

        // Filtrar por categoria
        if (category) {
          const decodedCategory = decodeURIComponent(category as string)
            .replace('+', ' ')
            .replace('mens', "men's")
            .replace('womens', "women's");

          allProducts = allProducts.filter(
            product => product.category === decodedCategory
          );
        }

        setProducts(allProducts);
        setFilteredProducts(allProducts);

        // Determinar preço máximo para o slider
        if (allProducts.length > 0) {
          const maxPrice = Math.ceil(Math.max(...allProducts.map(p => p.price)) / 100) * 100;
          setPriceRange([0, maxPrice]);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        // Em caso de erro, definir arrays vazios
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, category]);

  // Aplicar filtros e ordenação aos produtos
  useEffect(() => {
    let result = [...products];

    // Aplicar filtros
    if (onSale) {
      // Simular produtos em promoção (com rating > 4)
      result = result.filter(product => product.rating.rate > 4);
    }

    // Filtro de preço
    result = result.filter(product =>
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    );

    // Filtro de rating (estrelas)
    if (ratingFilter) {
      const minRating = parseInt(ratingFilter);
      result = result.filter(product => Math.floor(product.rating.rate) >= minRating);
    }

    // Filtro de quantidade mínima de avaliações
    if (minReviews > 0) {
      result = result.filter(product => product.rating.count >= minReviews);
    }

    // Aplicar ordenação
    switch (sortOption) {
      case 'preco-menor':
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'preco-maior':
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'avaliacao':
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'mais-avaliados':
        result.sort((a, b) => b.rating.count - a.rating.count);
        break;
      case 'relevantes':
      default:
        // Manter a ordem original ou ordenar por relevância
        break;
    }

    setFilteredProducts(result);
  }, [products, onSale, priceRange, ratingFilter, minReviews, sortOption]);

  const handleResetFilters = () => {
    setOnSale(false);
    // Redefinir preço máximo com base nos produtos disponíveis
    const maxPrice = products.length > 0
      ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100
      : 1000;
    setPriceRange([0, maxPrice]);
    setRatingFilter('');
    setMinReviews(0);
    setSortOption('relevantes');
  };

  const formatCategoryName = (category: string) => {
    const translations = {
      "men's clothing": "Roupas Masculinas",
      "women's clothing": "Roupas Femininas",
      "jewelery": "Joias",
      "electronics": "Eletrônicos"
    };

    // @ts-ignore
    return translations[category] || category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Determinar o preço máximo para o slider
  const maxPrice = products.length > 0
    ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100
    : 1000;

  const FilterSection = () => (
    <VStack align="stretch" spacing={6} p={4} bg="white" borderRadius="md" boxShadow="sm">
      <Box w={{ base: "100%", md: "250px" }} flexShrink={0}>
        <Accordion defaultIndex={[0, 1, 2, 3]} allowMultiple>
          {/* Filtro de Preço */}
          <AccordionItem border="1px solid" borderColor="gray.200" mb={4} borderRadius="md">
            <h2>
              <AccordionButton py={3} _hover={{ bg: "gray.50" }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="semibold">
                  Preço
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <VStack align="stretch" spacing={4}>
                <RangeSlider
                  aria-label={['min', 'max']}
                  value={priceRange}
                  min={0}
                  max={maxPrice}
                  onChange={(val) => setPriceRange([val[0], val[1]])}
                  colorScheme="orange"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack bg="#915a33" />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>

                <Flex justify="space-between">
                  <Text fontSize="sm">R$ {priceRange[0]}</Text>
                  <Text fontSize="sm">R$ {priceRange[1]}</Text>
                </Flex>

                <Flex flexWrap="wrap" gap={2} mt={2}>
                  <Button
                    size="xs"
                    onClick={() => setPriceRange([0, 50])}
                    variant={priceRange[0] === 0 && priceRange[1] === 50 ? "solid" : "outline"}
                    bg={priceRange[0] === 0 && priceRange[1] === 50 ? "#915a33" : "white"}
                    color={priceRange[0] === 0 && priceRange[1] === 50 ? "white" : "#915a33"}
                    borderColor="#915a33"
                  >
                    Até R$ 50
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => setPriceRange([50, 100])}
                    variant={priceRange[0] === 50 && priceRange[1] === 100 ? "solid" : "outline"}
                    bg={priceRange[0] === 50 && priceRange[1] === 100 ? "#915a33" : "white"}
                    color={priceRange[0] === 50 && priceRange[1] === 100 ? "white" : "#915a33"}
                    borderColor="#915a33"
                  >
                    R$ 50 - R$ 100
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => setPriceRange([100, 500])}
                    variant={priceRange[0] === 100 && priceRange[1] === 500 ? "solid" : "outline"}
                    bg={priceRange[0] === 100 && priceRange[1] === 500 ? "#915a33" : "white"}
                    color={priceRange[0] === 100 && priceRange[1] === 500 ? "white" : "#915a33"}
                    borderColor="#915a33"
                  >
                    R$ 100 - R$ 500
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => setPriceRange([500, maxPrice])}
                    variant={priceRange[0] === 500 && priceRange[1] === maxPrice ? "solid" : "outline"}
                    bg={priceRange[0] === 500 && priceRange[1] === maxPrice ? "#915a33" : "white"}
                    color={priceRange[0] === 500 && priceRange[1] === maxPrice ? "white" : "#915a33"}
                    borderColor="#915a33"
                  >
                    Acima de R$ 500
                  </Button>
                </Flex>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Filtro de Estrelas (Rating) */}
          <AccordionItem border="1px solid" borderColor="gray.200" mb={4} borderRadius="md">
            <h2>
              <AccordionButton py={3} _hover={{ bg: "gray.50" }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="semibold">
                  Avaliação
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <RadioGroup value={ratingFilter} onChange={setRatingFilter}>
                <VStack align="flex-start" spacing={2}>
                  <Radio
                    value=""
                    colorScheme="orange"
                    sx={{
                      '.chakra-radio__control': {
                        borderColor: '#915a33',
                        _checked: {
                          bg: '#915a33',
                          borderColor: '#915a33',
                        }
                      }
                    }}
                  >
                    Todas as estrelas
                  </Radio>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Radio
                      key={rating}
                      value={rating.toString()}
                      colorScheme="orange"
                      sx={{
                        '.chakra-radio__control': {
                          borderColor: '#915a33',
                          _checked: {
                            bg: '#915a33',
                            borderColor: '#915a33',
                          }
                        }
                      }}
                    >
                      <Flex align="center">
                        {Array(5).fill('').map((_, i) => (
                          <Text
                            key={i}
                            color={i < rating ? "yellow.400" : "gray.300"}
                          >
                            ★
                          </Text>
                        ))}
                        <Text fontSize="sm" ml={2} color="gray.600">
                          ou mais
                        </Text>
                        <Text fontSize="xs" ml={1} color="gray.500">
                          ({products.filter(p => Math.floor(p.rating.rate) >= rating).length})
                        </Text>
                      </Flex>
                    </Radio>
                  ))}
                </VStack>
              </RadioGroup>
            </AccordionPanel>
          </AccordionItem>

          {/* Filtro de Quantidade de Avaliações */}
          <AccordionItem border="1px solid" borderColor="gray.200" mb={4} borderRadius="md">
            <h2>
              <AccordionButton py={3} _hover={{ bg: "gray.50" }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="semibold">
                  Quantidade de Avaliações
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <RadioGroup value={minReviews.toString()} onChange={(val) => setMinReviews(Number(val))}>
                <VStack align="flex-start" spacing={2}>
                  <Radio
                    value="0"
                    colorScheme="orange"
                    sx={{
                      '.chakra-radio__control': {
                        borderColor: '#915a33',
                        _checked: {
                          bg: '#915a33',
                          borderColor: '#915a33',
                        }
                      }
                    }}
                  >
                    Qualquer quantidade
                  </Radio>
                  {[200, 150, 100, 50].map((count) => (
                    <Radio
                      key={count}
                      value={count.toString()}
                      colorScheme="orange"
                      sx={{
                        '.chakra-radio__control': {
                          borderColor: '#915a33',
                          _checked: {
                            bg: '#915a33',
                            borderColor: '#915a33',
                          }
                        }
                      }}
                    >
                      {count}+ avaliações
                      <Text fontSize="xs" ml={1} color="gray.500">
                        ({products.filter(p => p.rating.count >= count).length})
                      </Text>
                    </Radio>
                  ))}
                </VStack>
              </RadioGroup>
            </AccordionPanel>
          </AccordionItem>

          {/* Filtro de Ofertas e Promoção */}
          <AccordionItem border="1px solid" borderColor="gray.200" mb={4} borderRadius="md">
            <h2>
              <AccordionButton py={3} _hover={{ bg: "gray.50" }}>
                <Box as="span" flex='1' textAlign='left' fontWeight="semibold">
                  Oferta e Promoção
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <VStack align="flex-start" spacing={2}>
                <Checkbox
                  isChecked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                  colorScheme="orange"
                  borderColor="#915a33"
                  sx={{
                    '.chakra-checkbox__control': {
                      borderColor: '#915a33',
                      _checked: {
                        bg: '#915a33',
                        borderColor: '#915a33',
                      }
                    }
                  }}
                >
                  Descontaço
                  <Text as="span" ml={2} fontSize="xs" color="gray.500">
                    ({products.filter(p => p.rating.rate > 4).length})
                  </Text>
                </Checkbox>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Button
          w="100%"
          variant="outline"
          borderColor="#915a33"
          color="#915a33"
          onClick={handleResetFilters}
          mt={2}
        >
          Limpar Filtros
        </Button>
      </Box>
    </VStack>
  );

  if (loading) {
    return (
      <Layout>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" color="#915a33" thickness="4px" />
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        {/* Cabeçalho */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          mb={{ base: 4, md: 6 }}
          gap={{ base: 2, md: 0 }}
        >
          <Box mb={{ base: 2, md: 0 }}>
            <Heading
              as="h1"
              size={{ base: "lg", md: "xl" }}
              color="#333"
            >
              {category
                ? formatCategoryName(decodeURIComponent(category as string).replace('+', ' '))
                : searchQuery
                  ? `Resultados para "${searchQuery}"`
                  : 'Todos os Produtos'
              }
              <Text as="span" fontSize="md" fontWeight="normal" color="gray.600" ml={2}>
                ({filteredProducts.length} produtos encontrados)
              </Text>
            </Heading>
          </Box>

          {/* Ordenação */}
          <Box w="250px">
            <Flex alignItems="center" justifyContent="flex-end">
              <Text mr={2} fontSize="sm" color="gray.600">
                Ordenar por
              </Text>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                size="sm"
                w="160px"
                borderColor="#915a33"
                _focus={{ borderColor: "#915a33", boxShadow: "0 0 0 1px #915a33" }}
              >
                <option value="relevantes">Mais relevantes</option>
                <option value="preco-menor">Menor preço</option>
                <option value="preco-maior">Maior preço</option>
                <option value="avaliacao">Melhor avaliação</option>
                <option value="mais-avaliados">Mais avaliados</option>
              </Select>
            </Flex>
          </Box>

          {/* Botão de Filtro (Apenas Mobile) */}
          {isMobile && (
            <Button
              leftIcon={<Icon as={CiFilter} boxSize={4} />}
              variant="outline"
              onClick={onOpen}
              size="sm"
              width="full"
              borderColor="#915a33"
              color="#915a33"
              _hover={{ bg: "rgba(145, 90, 51, 0.1)" }}
            >
              Filtrar
            </Button>
          )}
        </Flex>

        <Flex gap={6} direction={{ base: "column", md: "row" }}>
          {/* Filtros (Desktop) */}
          {!isMobile && (
            <Box width="300px" flexShrink={0}>
              <FilterSection />
            </Box>
          )}

          {/* Lista de Produtos */}
          <Box flex="1">
            {filteredProducts.length === 0 ? (
              <Center flexDirection="column" py={10} gap={4}>
                <Heading size="md">Nenhum produto encontrado com os filtros selecionados</Heading>
                <Button
                  mt={4}
                  bg="#915a33"
                  color="white"
                  _hover={{ bg: "#A0522D" }}
                  onClick={handleResetFilters}
                >
                  Limpar filtros
                </Button>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 2, md: 3, lg: 3 }} spacing={6}>
                {filteredProducts.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} passHref>
                    <Card
                      maxW="sm"
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="sm"
                      transition="all 0.3s"
                      _hover={{ transform: "translateY(-8px)", boxShadow: "md" }}
                      cursor="pointer"
                      bg="white"
                      h="100%"
                    >
                      <Box position="relative" h="220px" bg="gray.50">
                        {product.rating.rate > 4 && (
                          <Badge
                            position="absolute"
                            top={3}
                            left={3}
                            bg="#E53E3E"
                            color="white"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                            zIndex={1}
                          >
                            -{Math.floor(Math.random() * 30 + 10)}%
                          </Badge>
                        )}
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          style={{ objectFit: "contain", padding: "16px" }}
                        />
                      </Box>
                      <CardBody>
                        <Stack spacing="3">
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            textTransform="uppercase"
                          >
                            {formatCategoryName(product.category)}
                          </Text>
                          <Heading size="sm" noOfLines={2} minH="40px">
                            {product.title}
                          </Heading>
                          <Box>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              textDecoration="line-through"
                            >
                              R$ {(product.price * 1.3).toFixed(2)}
                            </Text>
                            <Text
                              color="#915a33"
                              fontSize="xl"
                              fontWeight="bold"
                            >
                              R$ {product.price.toFixed(2)}
                            </Text>
                            <Text fontSize="xs" color="green.600" fontWeight="medium">
                              Em até 10x de R$ {(product.price / 10).toFixed(2)}
                            </Text>
                          </Box>
                          <HStack>
                            <Text color="yellow.500">★</Text>
                            <Text fontSize="sm" color="gray.600">
                              {product.rating.rate} ({product.rating.count})
                            </Text>
                          </HStack>
                        </Stack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Flex>

        {/* Drawer de Filtros (Mobile) */}
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size="sm"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Filtros</DrawerHeader>
            <DrawerBody>
              <FilterSection />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>
    </Layout>
  );
}
