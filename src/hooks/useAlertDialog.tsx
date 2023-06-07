import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';
import Form from './useForm';
const AlertDialogForm = ({
  onClickType,
  formValues,
  fields,
  isOpen,
  onClose,
  title,
  description,
  confirmButtonText = '确定',
  cancelButtonText = '取消',
  onConfirm
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();

  // const handleConfirm = async () => {
  //   setIsLoading(true);
  //   await onConfirm();
  //   setIsLoading(false);
  //   // onClose();
  // };
  const onSubmit = (val) => {
    console.log('sumbit1', val);
  };
  // const fields = [
  //   {
  //     type: 'text',
  //     name: 'name',
  //     label: 'name：'
  //   }
  // ];

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Form
              fields={fields}
              onSubmit={onConfirm}
              formData={formValues}
              type={onClickType}
              onClose={onClose}
            />
          </AlertDialogBody>

          {/* <AlertDialogFooter> */}
          {/* <Button ref={cancelRef} onClick={onClose}>
              {cancelButtonText}
            </Button>
            <Button colorScheme="red" ml={3} isLoading={isLoading} onClick={handleConfirm}>
              {confirmButtonText}
            </Button> */}
          {/* </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertDialogForm;
