import React, { useState } from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Grid,
    GridItem,
    useToast
} from '@chakra-ui/react';

interface AddressFormProps {
    onNext: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onNext }) => {
    const toast = useToast();
    const [formData, setFormData] = useState({
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validação simples
        if (!formData.cep || !formData.street || !formData.number || !formData.city || !formData.state) {
            toast({
                title: "Erro",
                description: "Por favor, preencha todos os campos obrigatórios",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Salvar no localStorage
        localStorage.setItem('deliveryAddress', JSON.stringify(formData));
        onNext();
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
                <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={4}>
                        <FormControl isRequired>
                            <FormLabel>CEP</FormLabel>
                            <Input
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                placeholder="00000-000"
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={8}>
                        <FormControl isRequired>
                            <FormLabel>Rua</FormLabel>
                            <Input
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Nome da rua"
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl isRequired>
                            <FormLabel>Número</FormLabel>
                            <Input
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                placeholder="123"
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={8}>
                        <FormControl>
                            <FormLabel>Complemento</FormLabel>
                            <Input
                                name="complement"
                                value={formData.complement}
                                onChange={handleChange}
                                placeholder="Apto, Bloco, etc"
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={12}>
                        <FormControl isRequired>
                            <FormLabel>Bairro</FormLabel>
                            <Input
                                name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleChange}
                                placeholder="Nome do bairro"
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={8}>
                        <FormControl isRequired>
                            <FormLabel>Cidade</FormLabel>
                            <Input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Nome da cidade"
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={4}>
                        <FormControl isRequired>
                            <FormLabel>Estado</FormLabel>
                            <Input
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="UF"
                            />
                        </FormControl>
                    </GridItem>
                </Grid>
            </VStack>
        </form>
    );
};
