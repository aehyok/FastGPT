import React, { useState } from 'react';
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

const Form = ({ fields, onSubmit }) => {
  const [formValues, setFormValues] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {fields.map((field) => (
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
                value={formValues[field.name] || ''}
                onChange={handleChange}
              />
            ) : field.type === 'select' ? (
              <Select
                name={field.name}
                value={formValues[field.name] || ''}
                onChange={handleChange}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : field.type === 'checkbox' ? (
              <Checkbox
                name={field.name}
                isChecked={formValues[field.name] || false}
                onChange={handleChange}
              >
                {field.label}
              </Checkbox>
            ) : (
              <Input
                type={field.type}
                name={field.name}
                value={formValues[field.name] || ''}
                onChange={handleChange}
              />
            )}
            <FormErrorMessage>{field.error}</FormErrorMessage>
            <FormHelperText>{field.helperText}</FormHelperText>
          </FormControl>
        ))}
        {/* <HStack>
          <Button type="submit">Submit</Button>
          <Button type="reset" onClick={() => setFormValues({})}>
            Reset
          </Button>
        </HStack> */}
      </VStack>
    </Box>
  );
};

export default Form;
