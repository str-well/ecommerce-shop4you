import React, { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Icon,
  Radio,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';
import { CiCreditCard1 } from "react-icons/ci";
import { BsQrCodeScan } from "react-icons/bs";
import { CiBarcode } from "react-icons/ci";
import { SavedCard } from './SavedCard';
import { CreditCardForm } from './CreditCardForm';

interface PaymentStepProps {
  onNext: () => void;
  totalAmount: number;
}

interface SavedCardType {
  id: string;
  number: string;
  holder: string;
  expiry: string;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ onNext, totalAmount }) => {
  const toast = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [showCardForm, setShowCardForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCardType[]>([
    { id: '1', number: '1779', holder: 'Wellington Bezerra', expiry: '06/2031' },
    { id: '2', number: '1100', holder: 'Wellington Bezerra', expiry: '05/2031' },
  ]);

  const handleSaveCard = () => {
    setShowCardForm(false);
    toast({
      title: "Cartão salvo com sucesso!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setSavedCards(cards => cards.filter(card => card.id !== cardId));
    if (selectedCard === cardId) {
      setSelectedCard(null);
    }
    toast({
      title: "Cartão removido com sucesso!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFinishPayment = () => {
    if (paymentMethod === 'credit' && !selectedCard && !showCardForm) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cartão ou adicione um novo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onNext();
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={6}>
        Forma de Pagamento
      </Text>
      <VStack align="stretch" spacing={4}>
        <Radio
          value="credit"
          isChecked={paymentMethod === 'credit'}
          onChange={() => setPaymentMethod('credit')}
          colorScheme="brown"
          borderColor="#774b2e"
          _checked={{
            bg: "#774b2e57",
            borderColor: "#774b2e",
          }}
        >
          <HStack>
            <Box as="span" fontSize="24px">
              <CiCreditCard1 />
            </Box>
            <Box>
              <Text>Cartão de crédito</Text>
              <Text fontSize="sm" color="gray.500">R$ {(totalAmount * 0.15).toFixed(2)} off à vista</Text>
            </Box>
          </HStack>
        </Radio>

        <Radio
          value="pix"
          isChecked={paymentMethod === 'pix'}
          onChange={() => setPaymentMethod('pix')}
          colorScheme="brown"
          borderColor="#774b2e"
          _checked={{
            bg: "#774b2e57",
            borderColor: "#774b2e",
          }}
        >
          <HStack>
            <Box as="span" fontSize="21px">
              <BsQrCodeScan />
            </Box>
            <Box>
              <Text>Pix</Text>
              <Text fontSize="sm" color="gray.500">R$ {(totalAmount * 0.15).toFixed(2)} off à vista</Text>
            </Box>
          </HStack>
        </Radio>

        <Radio
          value="boleto"
          isChecked={paymentMethod === 'boleto'}
          onChange={() => setPaymentMethod('boleto')}
          colorScheme="brown"
          borderColor="#774b2e"
          _checked={{
            bg: "#774b2e57",
            borderColor: "#774b2e",
          }}
        >
          <HStack>
            <Box as="span" fontSize="24px">
              <CiBarcode />
            </Box>
            <Box>
              <Text>Boleto</Text>
            </Box>
          </HStack>
        </Radio>

        {paymentMethod === 'credit' && (
          <Box pl={8}>
            {savedCards.map((card) => (
              <SavedCard
                key={card.id}
                isSelected={selectedCard === card.id}
                cardNumber={card.number}
                cardHolder={card.holder}
                expiry={card.expiry}
                onClick={() => setSelectedCard(card.id)}
                onDelete={() => handleDeleteCard(card.id)}
              />
            ))}

            <Button
              leftIcon={<Icon as={CiCreditCard1} />}
              variant="outline"
              onClick={() => setShowCardForm(!showCardForm)}
              borderColor="#774b2e"
              color="#774b2e"
              _hover={{ bg: "#f5efe9" }}
              mt={4}
            >
              Adicionar um cartão de crédito
            </Button>

            {showCardForm && (
              <CreditCardForm onSave={handleSaveCard} totalAmount={totalAmount} />
            )}
          </Box>
        )}

        {paymentMethod === 'pix' && (
          <Box pl={8}>
            <Text>QR Code do PIX</Text>
            <Box
              width="200px"
              height="200px"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={4}
            >
              <BsQrCodeScan size={100} />
            </Box>
          </Box>
        )}

        {paymentMethod === 'boleto' && (
          <Box pl={8}>
            <Text>Gerar Boleto</Text>
            <Button
              leftIcon={<Icon as={CiBarcode} />}
              variant="outline"
              mt={4}
              onClick={() => {/* Lógica para gerar boleto */ }}
            >
              Gerar Boleto
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
