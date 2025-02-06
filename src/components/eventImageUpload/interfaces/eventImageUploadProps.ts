import { Dispatch, SetStateAction } from "react";

export default interface EventImageUploadProps {
    onImageUpload: (urls: string[], files: File[]) => void;
    selectedImages: string[];
    setSelectedImages: Dispatch<SetStateAction<string[]>>;
    selectedFiles: File[];
    setSelectedFiles: Dispatch<SetStateAction<File[]>>;
}