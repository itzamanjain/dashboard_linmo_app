export default interface ModalProps {
    onClose: () => void;
    iconSrc: string;
    title: string;
    description: string;
    buttonText: string;
    buttonAction: () => void;
    isDeleteModal?: boolean
    deleteMultiple?: () => void;
}