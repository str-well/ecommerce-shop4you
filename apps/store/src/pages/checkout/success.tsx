import React from 'react';
import { Box, VStack, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

export default function Success() {
    const handleBackToStore = () => {
        window.location.href = 'http://localhost:3000';
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.50"
        >
            <VStack spacing={8} p={8} bg="white" borderRadius="lg" boxShadow="lg" maxW="md" w="full">
                <Icon as={FaCheckCircle} w={20} h={20} color="green.500" />

                <VStack spacing={4} textAlign="center">
                    <Heading size="xl" color="green.500">
                        Pedido Realizado!
                    </Heading>

                    <Text fontSize="lg" color="gray.600">
                        Seu pedido foi finalizado com sucesso. Em breve você receberá um e-mail com os detalhes da compra.
                    </Text>
                </VStack>

                <Button
                    leftIcon={<FaArrowLeft />}
                    colorScheme="brown"
                    size="lg"
                    onClick={handleBackToStore}
                    w="full"
                >
                    Voltar para a Loja
                </Button>
            </VStack>
        </Box>
    );
}
