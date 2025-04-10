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
  Heading,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  SimpleGrid,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api, Category } from '../services/api';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const router = useRouter();
  const { category: currentCategory, minPrice, maxPrice } = router.query;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentCategory as string || ''
  );

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(minPrice) || 0,
    Number(maxPrice) || 1000
  ]);

  useEffect(() => {
    // Carregar categorias da API
    api.getCategories()
      .then(setCategories)
      .catch(err => {
        console.error("Erro ao carregar categorias:", err);
      });
  }, []);

  // Atualizar estado quando as query params mudarem
  useEffect(() => {
    if (currentCategory) {
      setSelectedCategory(currentCategory as string);
    } else {
      setSelectedCategory('');
    }

    setPriceRange([
      Number(minPrice) || 0,
      Number(maxPrice) || 1000
    ]);
  }, [currentCategory, minPrice, maxPrice]);

  const formatCategoryName = (category: string) => {
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
        .join(' ');
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(window.location.search);

    // Limpar filtros anteriores
    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');

    // Adicionar filtros selecionados
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }

    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());

    // Navegar para a página de busca com os filtros
    router.push(`/search?${params.toString()}`);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
  };

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
          color="#915a33"
          fontSize={{ base: "lg", md: "xl" }}
          py={{ base: 4, md: 6 }}
        >
          Filtrar Produtos
        </DrawerHeader>

        <DrawerBody px={{ base: 3, md: 6 }}>
          <VStack spacing={{ base: 4, md: 6 }} align="stretch" py={{ base: 3, md: 5 }}>
            {/* Filtro de Categorias */}
            <Box>
              <Heading
                as="h3"
                size="sm"
                mb={{ base: 3, md: 4 }}
                fontSize={{ base: "md", md: "lg" }}
              >
                Categorias
              </Heading>
              <RadioGroup
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <Stack spacing={{ base: 1, md: 2 }}>
                  {categories.map((cat) => (
                    <Radio
                      key={cat.name}
                      value={cat.name}
                      colorScheme="orange"
                      size={{ base: "md", md: "lg" }}
                      sx={{
                        '.chakra-radio__control': {
                          borderColor: '#915a33',
                          _checked: {
                            bg: 'white',
                            borderColor: '#915a33',
                            color: '#915a33',
                            _before: {
                              bg: '#915a33'
                            }
                          }
                        }
                      }}
                    >
                      <Text fontSize={{ base: "sm", md: "md" }}>
                        {formatCategoryName(cat.name)}
                      </Text>
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>

            <Divider />

            {/* Filtro de Preço */}
            <Box>
              <Heading
                as="h3"
                size="sm"
                mb={{ base: 3, md: 4 }}
                fontSize={{ base: "md", md: "lg" }}
              >
                Faixa de Preço
              </Heading>
              <Box px={{ base: 2, md: 4 }}>
                <RangeSlider
                  aria-label={['min', 'max']}
                  defaultValue={[0, 1000]}
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onChange={handlePriceChange}
                  colorScheme="brown"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack bg="#915a33" />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={{ base: 5, md: 6 }} />
                  <RangeSliderThumb index={1} boxSize={{ base: 5, md: 6 }} />
                </RangeSlider>
              </Box>

              <Flex justify="space-between" mt={2} px={{ base: 2, md: 4 }}>
                <Text fontSize={{ base: "sm", md: "md" }}>R$ {priceRange[0]}</Text>
                <Text fontSize={{ base: "sm", md: "md" }}>R$ {priceRange[1]}</Text>
              </Flex>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 2, md: 3 }} mt={{ base: 3, md: 4 }}>
                <Button
                  size={{ base: "xs", md: "sm" }}
                  onClick={() => setPriceRange([0, 50])}
                  variant={priceRange[0] === 0 && priceRange[1] === 50 ? "solid" : "outline"}
                  colorScheme="brown"
                  bg={priceRange[0] === 0 && priceRange[1] === 50 ? "#915a33" : "white"}
                  color={priceRange[0] === 0 && priceRange[1] === 50 ? "white" : "#915a33"}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  Até R$ 50
                </Button>
                <Button
                  size={{ base: "xs", md: "sm" }}
                  onClick={() => setPriceRange([50, 100])}
                  variant={priceRange[0] === 50 && priceRange[1] === 100 ? "solid" : "outline"}
                  colorScheme="brown"
                  bg={priceRange[0] === 50 && priceRange[1] === 100 ? "#915a33" : "white"}
                  color={priceRange[0] === 50 && priceRange[1] === 100 ? "white" : "#915a33"}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  R$ 50 - R$ 100
                </Button>
                <Button
                  size={{ base: "xs", md: "sm" }}
                  onClick={() => setPriceRange([100, 500])}
                  variant={priceRange[0] === 100 && priceRange[1] === 500 ? "solid" : "outline"}
                  colorScheme="brown"
                  bg={priceRange[0] === 100 && priceRange[1] === 500 ? "#915a33" : "white"}
                  color={priceRange[0] === 100 && priceRange[1] === 500 ? "white" : "#915a33"}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  R$ 100 - R$ 500
                </Button>
                <Button
                  size={{ base: "xs", md: "sm" }}
                  onClick={() => setPriceRange([500, 1000])}
                  variant={priceRange[0] === 500 && priceRange[1] === 1000 ? "solid" : "outline"}
                  colorScheme="brown"
                  bg={priceRange[0] === 500 && priceRange[1] === 1000 ? "#915a33" : "white"}
                  color={priceRange[0] === 500 && priceRange[1] === 1000 ? "white" : "#915a33"}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  Acima de R$ 500
                </Button>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Botões de ação */}
            <Flex
              gap={{ base: 3, md: 4 }}
              mt={{ base: 2, md: 4 }}
              position="sticky"
              bottom={4}
              bg="white"
              pt={4}
              pb={1}
            >
              <Button
                variant="outline"
                onClick={handleClearFilters}
                flex="1"
                size={{ base: "md", md: "lg" }}
                borderColor="gray.300"
              >
                Limpar Filtros
              </Button>
              <Button
                bg="#915a33"
                color="white"
                onClick={handleApplyFilters}
                _hover={{ bg: "#A0522D" }}
                flex="1"
                size={{ base: "md", md: "lg" }}
              >
                Aplicar Filtros
              </Button>
            </Flex>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
