import React from 'react';
import { VscInfo } from 'react-icons/vsc';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

export default function InfoModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function copyToClipboard() {
    navigator.clipboard.writeText('connect@tamudatathon.com');
    const id = 'email-toast';
    if (!toast.isActive(id)) {
      toast({
        id,
        title: 'Email copied to clipboard!',
        status: 'success',
        position: 'bottom-right',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <div>
      <VscInfo className="scale-125 cursor-pointer" onClick={onOpen}>
        Open Modal
      </VscInfo>
      <Modal size="xs" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="text-gray-700">
                This is Datathon's help queue! If you need help during the event, please use this and a mentor
                will assist you shortly! This project used TAMUHack's HelpR as a base.
            </p>
            <p className="my-4 text-gray-700">
              This Help Queue is currently under development. If you experience any
              problems, please reach out to TAMU Datathon at {' '}
              <a
                className="underline cursor-pointer font-medium"
                onClick={() => copyToClipboard()}
              >
                connect@tamudatathon.com
              </a>
              {" "}or reach out to a team member.
            </p>
            <p className="my-4 text-gray-700">
              If you are a mentor/volunteer, please reach out to a Datathon organizer so they can help
              get you situated.
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
