import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  VStack,
  HStack,
  Box
} from '@chakra-ui/react';

const Form = ({
  fields,
  onSubmit,
  formData,
  type,
  onClose
}: {
  fields: any;
  onSubmit: (formValues: { [key: string]: string }, type: string) => void;
  formData: { [key: string]: string };
  type: string;
  onClose: () => void;
}) => {
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(formValues, type);
    setIsLoading(false);
    onClose();
  };

  // setFormValues(formData)
  useEffect(() => {
    /** 执行逻辑 */
    setFormValues(formData);
  }, []);

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {fields.map((field: Record<string, any>) => (
          <FormControl
            key={field.name}
            id={field.name}
            isRequired={field.required}
            isInvalid={field.error}
          >
            <FormLabel>{field.label}</FormLabel>
            {field.type === 'textarea' ? (
              <Textarea
                name={field.name}
                // @ts-ignore
                value={formValues[field.name] || ''}
                onChange={handleChange}
              />
            ) : field.type === 'select' ? (
              <Select
                name={field.name}
                // @ts-ignore
                value={formValues[field.name] || ''}
                onChange={handleChange}
              >
                {field.options.map((option: Record<string, any>) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : field.type === 'checkbox' ? (
              <Checkbox
                name={field.name}
                // @ts-ignore
                isChecked={formValues[field.name] || false}
                onChange={handleChange}
              >
                {field.label}
              </Checkbox>
            ) : (
              <Input
                type={field.type}
                name={field.name}
                // @ts-ignore
                value={formValues[field.name] || ''}
                onChange={handleChange}
              />
            )}
            <FormErrorMessage>{field.error}</FormErrorMessage>
            <FormHelperText>{field.helperText}</FormHelperText>
          </FormControl>
        ))}
        <HStack display="flex" justifyContent={'flex-end'}>
          <Box mb="10px">
            <Button type="reset" onClick={() => setFormValues({})} mr="10px">
              清空
            </Button>
            <Button type="submit" colorScheme="red" isLoading={isLoading}>
              确定
            </Button>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Form;
