import Image from "next/image";
import { memo } from "react"
import Cropper from "react-easy-crop";

import ImageUploadModalProps from "./interfaces/imageUploadModal";

const ImageUploadModal = (props: ImageUploadModalProps) => {
    const {
        activeIndex,
        imageUrl,
        zoom,
        crop,
        showCropper,
        fileInputRef,
        handleChangeImageClick,
        handleCropImage,
        handleDragOver,
        handleDrop,
        handleImageChange,
        onCropComplete,
        setCrop,
        setIsModalVisible,
        setShowCropper,
        setZoom
    } = props;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm p-4 sm:p-0"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => setIsModalVisible(false)}
        >
            <div
                className="bg-black rounded-2xl p-6 w-[628px] max-w-full flex flex-col items-center justify-center gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center justify-center gap-2">
                    <h2 className="font-semibold text-custom-22 leading-7 text-white">{showCropper ? 'Crop ' : 'Upload '}Image</h2>
                    <p className="text-darkgray font-normal text-base leading-6">
                        For better result, use a PNG, JPG, or GIF image at least 300 x 300 px
                    </p>
                    <input
                        ref={fileInputRef}
                        id={`file-input-${activeIndex}`}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    {imageUrl
                        ? <div className="flex flex-col gap-6 justify-center items-center w-full">
                            <div className="relative rounded-xl w-[500px] h-[300px] mt-4">
                                <Cropper
                                    image={imageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1 / 1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    showGrid={false}
                                />
                            </div>
                            <div className="my-4 flex items-center gap-3">
                                <Image
                                    src="/static/select-img.svg"
                                    alt="Select Image"
                                    width={16}
                                    height={16}
                                />
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="custom-range"
                                />
                                <Image
                                    src="/static/select-img.svg"
                                    alt="Select Image"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <div className="flex gap-4 items-center">
                                <button
                                    className="bg-darkJungle w-[120px] h-[48px] text-white font-bold text-sm leading-custom-22 rounded-[0.625rem]"
                                    onClick={() => setIsModalVisible(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green w-[120px] h-[48px] text-black font-bold text-sm leading-custom-22 rounded-[0.625rem]"
                                    onClick={handleCropImage}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        : <div className="flex flex-col gap-6 justify-center items-center w-full">
                            <div
                                className="bg-rangoonGreen border border-dashed border-darkMetal flex flex-col justify-center items-center rounded-xl min-h-[200px] w-[200px] cursor-pointer mt-4"
                                onClick={handleChangeImageClick}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <Image
                                    src="/static/select-img.svg"
                                    alt="Select Image"
                                    width={20}
                                    height={18}
                                    onDragStart={(e) => e.preventDefault()}
                                />
                                <h4 className="pt-4 text-white font-normal text-sm leading-custom-22">
                                    Select your image
                                </h4>
                            </div>
                            {/* <div className="flex gap-6 w-full items-center">
                                        <span className="flex-grow border-t border-darkMetal h-[1px]"></span>
                                        <p className="text-gray font-medium text-xs leading-custom-18">Or select an uploaded photo</p>
                                        <span className="flex-grow border-t border-darkMetal h-[1px]"></span>
                                    </div>
                                    <div className="flex items-center justify-start w-full gap-3 flex-wrap">
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <div key={index} className="w-[106px] h-[106px] rounded-lg overflow-hidden cursor-pointer">
                                                <Image
                                                    src="/static/event.svg"
                                                    alt="Image"
                                                    width={106}
                                                    height={106}
                                                    className="w-full"
                                                    objectFit="cover"
                                                />
                                            </div>
                                        ))}
                                    </div> */}
                            <div className="flex gap-4 items-center mt-4">
                                <button
                                    className="bg-darkJungle w-[120px] h-[48px] text-white font-bold text-sm leading-custom-22 rounded-[0.625rem]"
                                    onClick={() => setIsModalVisible(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-green w-[120px] h-[48px] text-black font-bold text-sm leading-custom-22 rounded-[0.625rem]"
                                    onClick={() => setShowCropper(true)}
                                    disabled={!imageUrl}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default memo(ImageUploadModal);