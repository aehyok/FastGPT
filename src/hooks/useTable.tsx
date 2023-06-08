import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Box,
  Text,
  Flex,
  useDisclosure
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import AlertDialogForm from './useAlertDialog';
import { useOperationBtnHook } from '@/constants/company';
const SearchableTable = ({ data, columns, operatingButton, onConfirm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formConfig, setFormConfig] = useState({});
  const [formValues, setFormValues] = useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { identificationFun } = useOperationBtnHook({ onOpen });
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // const onConfirm = () => {
  //   console.log('asdad');
  // };

  const btnClick = ({
    onClickType,
    fields,
    dialogTitle,
    dialogDescription
  }: {
    onClickType: string;
    fields: any;
    dialogTitle: string;
    dialogDescription: string;
  }) => {
    identificationFun(onClickType);
    const formData = {
      formList: fields,
      title: dialogTitle,
      description: dialogDescription,
      onClickType: onClickType
    };
    console.log(formData, 'formData');

    setFormConfig(formData);
  };

  return (
    <Box>
      <AlertDialogForm
        onClickType={formConfig.onClickType}
        formValues={formValues}
        fields={formConfig?.formList}
        isOpen={isOpen}
        onClose={onClose}
        description={formConfig.description}
        title={formConfig.title}
        onConfirm={onConfirm}
      />

      <Flex w={'100%'} display="flex" justifyContent={'space-between'}>
        <Box>
          {operatingButton.map((item, index) =>
            item.type === 'head' ? (
              <Button
                ml={2}
                onClick={() => {
                  setFormValues({}), btnClick(item);
                }}
                disabled={!searchTerm}
                colorScheme="blue"
                variant="outline"
                key={index}
              >
                {item.name}
              </Button>
            ) : (
              ''
            )
          )}
        </Box>
        <Box>
          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input
              type="text"
              placeholder="Search"
              width="auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button ml={2} onClick={() => setSearchTerm('')} disabled={!searchTerm}>
              Clear
            </Button>
          </InputGroup>
        </Box>
      </Flex>
      {filteredData.length > 0 ? (
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column}>{column}</Th>
              ))}
              <Th>OPERATION</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((item, index) => (
              <Tr key={index}>
                {Object.values(columns).map((value, index) => (
                  <Td key={index}>{item[value]}</Td>
                ))}
                <Td>
                  {operatingButton.map((btnItem, btnindex) =>
                    btnItem.type !== 'head' ? (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setFormValues(item), btnClick(btnItem);
                        }}
                        disabled={!searchTerm}
                        colorScheme="blue"
                        key={btnindex}
                      >
                        {btnItem.render ? btnItem.render(item) : btnItem.name}
                      </Button>
                    ) : (
                      ''
                    )
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No results found</Text>
      )}
    </Box>
  );
};

export default SearchableTable;
