import Image from "next/image";
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { Area, Point } from "react-easy-crop";
import { Swiper, SwiperSlide } from "swiper/react";

import ImageUploadModal from "../modals/imageUploadModal/imageUploadModal";

import useSliceSelector from "@/hooks/useSliceSelector";

import EventImageUploadProps from "./interfaces/eventImageUploadProps";

import "swiper/css";

const EventImageUpload = (props: EventImageUploadProps) => {
    const { onImageUpload, selectedImages, setSelectedImages, selectedFiles, setSelectedFiles } = props;

    const [placeholderCount, setPlaceholderCount] = useState<number>(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [zoom, setZoom] = useState<number>(1);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
    const [, setCroppedArea] = useState<Area>();
    const [, setTempCroppedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showCropper, setShowCropper] = useState<boolean>(false);
    const isEditingEvent = useSliceSelector(state => state.dashboard.isEditingEvent);

    const dataURLtoFile = useCallback(async (dataUrl: string, filename: string) => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    }, []);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);

        handleFiles(files);
    };

    const updateImageStates = useCallback((file: File, url: string) => {
        setImageUrl(url);
        setTempCroppedImage(null);
        setShowCropper(false);

        setSelectedImages((prev) => {
            const newImages = [...prev];
            if (activeIndex >= 0) {
                newImages[activeIndex] = url;
            } else {
                newImages.push(url);
            }
            return newImages;
        });

        setSelectedFiles((prev) => {
            const newFiles = [...prev];
            if (activeIndex >= 0) {
                newFiles[activeIndex] = file;
            } else {
                newFiles.push(file);
            }
            return newFiles;
        });

        onImageUpload(selectedImages, selectedFiles);
    }, [setImageUrl, setTempCroppedImage, setShowCropper, setSelectedImages, setSelectedFiles, onImageUpload, activeIndex, selectedFiles, selectedImages]);

    const handleFiles = useCallback((files: File[]) => {
        if (files && activeIndex !== null) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            updateImageStates(file, url);
        }
    }, [updateImageStates, activeIndex]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }, []);

    const handleChangeImageClick = useCallback(() => {
        if (activeIndex >= 0 && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [fileInputRef, activeIndex]);

    const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && activeIndex !== null) {
            const file = files[0];
            const url = URL.createObjectURL(file);

            updateImageStates(file, url);
        }
    }, [activeIndex, updateImageStates]);

    const removeImage = useCallback((index: number) => {
        const newImages = [...selectedImages];
        const newFileObjects = [...selectedFiles];

        newImages.splice(index, 1);
        newFileObjects.splice(index, 1);

        onImageUpload(newImages, newFileObjects);

        if (activeIndex === index) {
            setActiveIndex(newImages.length > 0 ? Math.max(0, index - 1) : -1);
        }

        if (newImages.length < placeholderCount) {
            setPlaceholderCount(newImages.length || 1);
        }
    }, [onImageUpload, setActiveIndex, setPlaceholderCount, activeIndex, placeholderCount, selectedFiles, selectedImages]);

    const addPlaceholderSlide = useCallback(() => {
        if (isEditingEvent) {
            setSelectedImages((prev) => [...prev, ""]);
        } else {
            setPlaceholderCount((prev) => prev + 1);
        }
    }, [setSelectedImages, setPlaceholderCount, isEditingEvent]);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
        setCroppedArea(croppedArea);
    }, [setCroppedAreaPixels, setCroppedArea]);

    const handleCropImage = async () => {
        if (croppedAreaPixels && imageUrl && activeIndex !== null && activeIndex >= 0) {
            const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
            const croppedFile = await dataURLtoFile(croppedImage, `cropped_image_${activeIndex}.jpg`);

            const updatedImages = [...selectedImages];
            const updatedFiles = [...selectedFiles];

            updatedImages[activeIndex!] = croppedImage;
            updatedFiles[activeIndex!] = croppedFile;

            onImageUpload(updatedImages, updatedFiles.filter(Boolean));

            setIsModalVisible(false);
            setImageUrl(null);
            setShowCropper(false);
        }
    };

    const getCroppedImg = useCallback((imageSrc: string, croppedAreaPixels: Area) => {
        return new Promise<string>((resolve, reject) => {
            const image = new window.Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;

                const cropX = croppedAreaPixels.x * scaleX;
                const cropY = croppedAreaPixels.y * scaleY;
                const cropWidth = croppedAreaPixels.width * scaleX;
                const cropHeight = croppedAreaPixels.height * scaleY;

                canvas.width = cropWidth;
                canvas.height = cropHeight;

                ctx.drawImage(
                    image,
                    cropX,
                    cropY,
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    cropWidth,
                    cropHeight
                );

                resolve(canvas.toDataURL("image/jpeg", 1.0));
            };
            image.onerror = (error) => reject(error);
        });
    }, []);

    useEffect(() => {
        return () => {
            selectedImages.forEach((image) => {
                if (image) URL.revokeObjectURL(image);
            });
        };
    }, [selectedImages]);

    useEffect(() => {
        if (activeIndex >= 0 && selectedImages[activeIndex]) {
            setImageUrl(selectedImages[activeIndex]);
        } else {
            setImageUrl(null);
        }
    }, [activeIndex, selectedImages]);

    return (
        <>
            <Swiper
                spaceBetween={16}
                slidesPerView={3}
                loop={false}
                className="w-full"
            >
                {isEditingEvent ?
                    selectedImages.map((image, index) => {
                        return (
                            <SwiperSlide
                                key={index}
                                className={`!w-1/3 !flex flex-col justify-center items-center rounded-xl min-h-[200px] cursor-pointer ${!image ? 'bg-darkMetal' : ''}`}
                                onClick={() => {
                                    setActiveIndex(index);
                                    setIsModalVisible(true);
                                }}>
                                {image ? (
                                    <div className="relative w-full min-h-[200px] 2xl:h-auto">
                                        <Image
                                            src={image}
                                            alt={`Uploaded Image ${index + 1}`}
                                            width={219}
                                            height={200}
                                            className="rounded-xl w-full"
                                            objectFit="cover"
                                        />
                                        {index === 0 && (
                                            <div className="absolute top-3 left-3 bg-darkJungle rounded-full px-3 py-1">
                                                <h4 className="text-white text-xs font-semibold leading-custom-18">Cover</h4>
                                            </div>
                                        )}
                                        {index !== 0 && (
                                            <Image
                                                src="/static/orange-minus.svg"
                                                alt="Remove Image"
                                                width={28}
                                                height={28}
                                                className="absolute top-1 right-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(index);
                                                }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Image
                                            src="/static/select-img.svg"
                                            alt="Select Image"
                                            width={20}
                                            height={18}
                                        />
                                        <h4 className="pt-4 text-white font-normal text-sm leading-custom-22">Select Image</h4>
                                    </>
                                )}
                            </SwiperSlide>
                        )
                    })
                    : Array.from({ length: placeholderCount }).map((_, index) => (
                        <SwiperSlide
                            key={index + selectedImages.length}
                            className={`!w-1/3 !flex flex-col justify-center items-center rounded-xl min-h-[200px] cursor-pointer ${!selectedImages[index] ? 'bg-darkMetal' : ''}`}
                            onClick={() => {
                                setActiveIndex(index);
                                setIsModalVisible(true);
                            }}>
                            {selectedImages[index] ? (
                                <div className="relative w-full h-[200px] 2xl:h-auto">
                                    <Image
                                        src={selectedImages[index]}
                                        alt={`Uploaded Image ${index + 1}`}
                                        width={219}
                                        height={200}
                                        objectFit="cover"
                                        className="rounded-xl w-full"
                                    />
                                    {index === 0 && (
                                        <div className="absolute top-3 left-3 bg-darkJungle rounded-full px-3 py-1">
                                            <h4 className="text-white text-xs font-semibold leading-custom-18">Cover</h4>
                                        </div>
                                    )}
                                    {index !== 0 && (
                                        <Image
                                            src="/static/orange-minus.svg"
                                            alt="Remove Image"
                                            width={28}
                                            height={28}
                                            className="absolute top-1 right-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Image
                                        src="/static/select-img.svg"
                                        alt="Select Image"
                                        width={20}
                                        height={18}
                                    />
                                    <h4 className="pt-4 text-white font-normal text-sm leading-custom-22">Select Image</h4>
                                </>
                            )}
                        </SwiperSlide>
                    ))}
                <SwiperSlide
                    className="!w-1/3 bg-darkMetal !flex flex-col justify-center items-center rounded-xl min-h-[200px] cursor-pointer"
                    onClick={addPlaceholderSlide}
                >
                    <div className="flex flex-col items-center justify-center">
                        <Image
                            src="/static/circled-plus.svg"
                            alt="Add More"
                            width={20}
                            height={20}
                        />
                        <h4 className="pt-4 text-white font-normal text-sm leading-custom-22">Add More</h4>
                    </div>
                </SwiperSlide>
            </Swiper>
            {isModalVisible && <ImageUploadModal
                activeIndex={activeIndex}
                imageUrl={imageUrl}
                zoom={zoom}
                crop={crop}
                showCropper={showCropper}
                setShowCropper={setShowCropper}
                setZoom={setZoom}
                setCrop={setCrop}
                handleImageChange={handleImageChange}
                handleChangeImageClick={handleChangeImageClick}
                handleDragOver={handleDragOver}
                handleFiles={handleFiles}
                handleDrop={handleDrop}
                onCropComplete={onCropComplete}
                handleCropImage={handleCropImage}
                fileInputRef={fileInputRef}
                setIsModalVisible={setIsModalVisible}
            />
            }
        </>
    );
};

export default memo(EventImageUpload);