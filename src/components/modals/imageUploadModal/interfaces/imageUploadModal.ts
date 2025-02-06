import { RefObject } from "react";
import { Area, Point } from "react-easy-crop";

export default interface ImageUploadModalProps {
    activeIndex: number;
    imageUrl: string | null;
    zoom: number;
    crop: Point;
    showCropper: boolean;
    setIsModalVisible: (value: boolean) => void;
    setShowCropper: (value: boolean) => void;
    setZoom: (value: number) => void;
    setCrop: (point: Point) => void;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeImageClick: () => void;
    handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    handleFiles: (files: File[]) => void;
    handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    handleCropImage: () => void;
    fileInputRef: RefObject<HTMLInputElement>;
}