import React, { ReactNode, RefObject, useState } from 'react';
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
}: {
  onClickType: string;
  formValues: any;
  fields: any;
  isOpen: boolean;
  onClose: () => void;
  description: (val: { [key: string]: string }) => ReactNode | string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  title: (val: { [key: string]: string }) => ReactNode | string;
  onConfirm: (val: { [key: string]: string }, type: string) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef() as RefObject<any>;

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {typeof title === 'function' ? title(formValues) : title}
          </AlertDialogHeader>

          <AlertDialogBody>
            {fields?.length > 0 ? (
              <Form
                fields={fields}
                onSubmit={onConfirm}
                formData={formValues}
                type={onClickType}
                onClose={onClose}
              />
            ) : (
              <div>{typeof description === 'function' ? description(formValues) : description}</div>
            )}
            {/* <Form
              fields={fields}
              onSubmit={onConfirm}
              formData={formValues}
              type={onClickType}
              onClose={onClose}
            /> */}
          </AlertDialogBody>
          {fields?.length > 0 ? (
            ''
          ) : (
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {cancelButtonText}
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                isLoading={isLoading}
                onClick={() => {
                  onConfirm(formValues, onClickType);
                  onClose();
                }}
              >
                {confirmButtonText}
              </Button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertDialogForm;
