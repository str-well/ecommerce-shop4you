import {
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { BsCart3, BsTruck } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import { useCart } from '../contexts/CartContext';
import { AddressForm } from './AddressForm';
import { CartItem } from './CartItem';
import { PaymentStep } from './PaymentStep';

const MotionBox = motion(Box);

interface StepIconProps {
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}

const StepIcon: React.FC<StepIconProps> = ({ isActive, icon, label }) => (
  <VStack spacing={2} flex={1}>
    <Circle
      size="50px"
      bg={isActive ? "#c19872" : "gray.200"}
      color={isActive ? "white" : "gray.500"}
    >
      {icon}
    </Circle>
    <Text color={isActive ? "#c19872" : "gray.500"}>{label}</Text>
  </VStack>
);
interface OrderSummaryProps {
  total: number;
  frete: number;
  currentStep: number;
  stepsLength: number;
  onFinish: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  total,
  frete,
  currentStep,
  stepsLength,
  onFinish,
  onNext,
  onPrevious
}) => {
  const brownButtonStyle = {
    bg: "#774b2e",
    color: "white",
    size: "lg" as const,
    _hover: { bg: "#c19872" },
    _active: { bg: "#5c3a24" },
    fontSize: "md",
    fontWeight: "semibold",
    h: "56px",
    transition: "all 0.2s"
  };

  return (
    <Box w={{ base: 'full', lg: '380px' }}>
      <Box
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        borderColor="gray.200"
        bg="white"
        position="sticky"
        top={4}
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text color="gray.600">Subtotal</Text>
            <Box textAlign="right">
              <Text as="s" color="gray.400" fontSize="sm">
                R$ {(total * 1.15).toFixed(2)}
              </Text>
              <Text fontWeight="bold">
                R$ {total.toFixed(2)}
              </Text>
            </Box>
          </HStack>
          <HStack justify="space-between">
            <Text color="gray.600">Frete</Text>
            <Text>R$ {frete.toFixed(2)}</Text>
          </HStack>
          <Divider />
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Total
            </Text>
            <Box textAlign="right">
              <Text fontSize="xl" fontWeight="bold">
                R$ {(total + frete).toFixed(2)}
              </Text>
              <Text color="gray.500" fontSize="sm">
                à vista no cartão ou Pix
              </Text>
              <Text color="gray.500" fontSize="xs">
                ou R$ {((total + frete) * 1.15).toFixed(2)} em até 10x
              </Text>
            </Box>
          </HStack>
          {currentStep === stepsLength - 1 ? (
            <Button {...brownButtonStyle} onClick={onFinish}>Finalizar</Button>
          ) : (
            <Button {...brownButtonStyle} onClick={onNext}>Continuar</Button>
          )}
          {currentStep > 0 && (
            <Button colorScheme="orange" size="sm" variant="outline" onClick={onPrevious}>
              Voltar
            </Button>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

interface CheckoutStepsProps {
  currentStep: number;
  steps: Array<{ title: string; icon: React.ReactNode }>;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep, steps }) => (
  <HStack spacing={8} mb={8} justify="center">
    {steps.map((step, index) => (
      <React.Fragment key={step.title}>
        <StepIcon
          isActive={currentStep >= index}
          icon={<Box as="span" fontSize="24px">{step.icon}</Box>}
          label={step.title}
        />
        {index < steps.length - 1 && <Divider borderColor="gray.300" />}
      </React.Fragment>
    ))}
  </HStack>
);

interface CheckoutProps {
  onFinish: () => void;
}

interface CartItemData {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const Checkout: React.FC<CheckoutProps> = ({ onFinish }) => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const frete = 176.11;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const previousStep = () => setCurrentStep(prev => prev - 1);

  const finishStep = () => {
    try {
      localStorage.removeItem('cart');
      if (typeof onFinish === 'function') {
        onFinish();
      } else {
        window.location.href = 'http://localhost:3000/checkout/success';
      }
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
    }
  };

  const steps = [
    {
      title: "Carrinho",
      icon: <BsCart3 />,
      content: (
        <VStack spacing={4} align="stretch">
          {items.map((item) => {
            const cartItem: CartItemData = {
              id: item.id,
              title: item.title || '',
              price: item.price,
              quantity: item.quantity,
              image: item.image || ''
            };
            return (
              <CartItem
                key={cartItem.id}
                item={cartItem}
                onQuantityChange={handleQuantityChange}
                onRemove={removeItem}
              />
            );
          })}
        </VStack>
      ),
    },
    {
      title: "Entrega",
      icon: <BsTruck />,
      content: <AddressForm onNext={nextStep} />,
    },
    {
      title: "Pagamento",
      icon: <CiCreditCard1 />,
      content: <PaymentStep onNext={nextStep} totalAmount={total + frete} />,
    },
  ];

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="xl" fontWeight="bold">
          Seu carrinho está vazio
        </Text>
        <Text color="gray.500">
          Adicione produtos para começar a comprar
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      <CheckoutSteps currentStep={currentStep} steps={steps} />
      <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
        <Box flex={1} overflow="hidden">
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentStep}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].content}
            </MotionBox>
          </AnimatePresence>
        </Box>
        <OrderSummary
          total={total}
          frete={frete}
          currentStep={currentStep}
          stepsLength={steps.length}
          onFinish={finishStep}
          onNext={nextStep}
          onPrevious={previousStep}
        />
      </Flex>
    </Box>
  );
};

export default Checkout;
