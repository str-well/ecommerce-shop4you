import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
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
  Spinner,
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
import { Layout } from '../../components/Layout';
import { api, Product } from '../../services/api';


export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [ratingFilter, setRatingFilter] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedReviewCount, setSelectedReviewCount] = useState<string>('');
  const [minReviews, setMinReviews] = useState<number>(0);
  const [onSale, setOnSale] = useState<boolean>(false);



  useEffect(() => {
    if (category) {
      setLoading(true);
      api.getProductsByCategory(String(category))
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);

          // Encontrar o preço máximo para o slider
          if (data.length > 0) {
            const highest = Math.ceil(Math.max(...data.map(p => p.price)));
            setMaxPrice(highest);
            setPriceRange([0, highest]);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao buscar produtos:', error);
          setLoading(false);
        });
    }
  }, [category]);


  const filterProducts = () => {
    let filtered: Product[] = [...products];

    // Filtro de preço
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filtro de avaliação
    if (selectedRating > 0) {
      filtered = filtered.filter(
        (product) => product.rating.rate >= selectedRating
      );
    }

    // Filtro de quantidade de avaliações
    if (selectedReviewCount) {
      filtered = filtered.filter((product) => {
        const count = product.rating.count;
        switch (selectedReviewCount) {
          case '500+':
            return count >= 500;
          case '100-499':
            return count >= 100 && count < 500;
          case '50-99':
            return count >= 50 && count < 100;
          case '10-49':
            return count >= 10 && count < 50;
          case '<10':
            return count < 10;
          default:
            return true;
        }
      });
    }

    // Aplicar ordenação
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a: Product, b: Product) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a: Product, b: Product) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a: Product, b: Product) => b.rating.rate - a.rating.rate);
        break;
      case 'reviews':
        filtered.sort((a: Product, b: Product) => b.rating.count - a.rating.count);
        break;
      default:
        // Mantém a ordem original para "Mais relevantes"
        break;
    }

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedPriceRange('');
    setSelectedRating(0);
    setSelectedReviewCount('');
    setRatingFilter('');
    setSortOption('default');
    setMinReviews(0);
    setOnSale(false);
    setSelectedPriceRange('');
    setSelectedRating(0);
    setSelectedReviewCount('');
    setRatingFilter('');
    setSortOption('default');
    setMinReviews(0);
    setOnSale(false);
  };

  useEffect(() => {
    filterProducts();
  }, [products, priceRange, ratingFilter, sortOption]);

  const formatCategoryName = (catName: string) => {
    const translations: Record<string, string> = {
      "men's clothing": "Roupas Masculinas",
      "women's clothing": "Roupas Femininas",
      "jewelery": "Joias",
      "electronics": "Eletrônicos"
    };

    return translations[catName] ||
      catName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  const FilterSection = () => (
    <VStack align="stretch" spacing={6} p={4} bg="white" borderRadius="md" boxShadow="sm">
      {/* Filtro de Preço */}
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
          onClick={
            resetFilters
          }
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

  if (!products.length) {
    return (
      <Layout>
        <Container maxW="container.xl">
          <Box py={10} textAlign="center">
            <Heading mb={4} size="lg">Nenhum produto encontrado</Heading>
            <Text mb={6}>Não encontramos produtos na categoria {formatCategoryName(String(category))}.</Text>
            <Button
              as={Link}
              href="/"
              bg="#915a33"
              color="white"
              _hover={{ bg: "#A0522D" }}
            >
              Voltar para a Página Inicial
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
        {/* Breadcrumbs */}
        <HStack spacing={2} fontSize="sm" color="gray.500" mb={{ base: 3, md: 5 }}>
          <Link href="/" passHref>
            <Text _hover={{ color: "#915a33" }}>Home</Text>
          </Link>
          <Text>›</Text>
          <Text color="#915a33">{formatCategoryName(String(category))}</Text>
        </HStack>

        {/* Cabeçalho da Categoria */}
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
              {formatCategoryName(String(category))}
            </Heading>
            <Text color="gray.600" mt={1}>
              {filteredProducts.length} produtos encontrados
            </Text>
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
                <option value="default">Mais relevantes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="rating">Melhor avaliação</option>
                <option value="reviews">Mais avaliados</option>
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
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={{ base: 4, md: 6 }}
            >
              {filteredProducts.map((product) => (
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
                  <Box position="relative" height={{ base: "150px", md: "200px" }}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      style={{ objectFit: "contain", padding: "16px" }}
                    />
                  </Box>

                  <Box p={{ base: 3, md: 4 }}>
                    <Text
                      fontWeight="medium"
                      noOfLines={2}
                      fontSize={{ base: "xs", md: "sm" }}
                      minH={{ base: "34px", md: "40px" }}
                      mb={2}
                    >
                      {product.title}
                    </Text>

                    <Flex align="center" mb={2}>
                      <Text color="yellow.400" fontSize={{ base: "xs", md: "sm" }} mr={1}>
                        {'\u2605'}
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                        {product.rating.rate.toFixed(1)}
                      </Text>
                    </Flex>

                    <Text
                      fontWeight="bold"
                      color="#915a33"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      R$ {product.price.toFixed(2)}
                    </Text>

                    <Text fontSize={{ base: "2xs", md: "xs" }} color="green.600" mt={1}>
                      Em até 10x de R$ {(product.price / 10).toFixed(2)}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Grid>
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
