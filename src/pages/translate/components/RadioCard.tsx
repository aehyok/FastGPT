import { useRadio, getInputProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
export function RadioCard(props) {
  console.log(props, 'props');

  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600'
        }}
        _focus={{
          boxShadow: 'outline'
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}
