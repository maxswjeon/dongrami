import { Divider, Modal, ModalBody, ModalHeader } from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function CurrencyModal({ ...props }: Props) {
  return (
    <Modal {...props}>
      <ModalHeader>Currency Settings</ModalHeader>
      <ModalBody>
        <Divider />
      </ModalBody>
    </Modal>
  );
}
