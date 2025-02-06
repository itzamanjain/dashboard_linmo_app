import { Dispatch, SetStateAction } from "react";

export default interface CategoriesProps {
    selectedCategory: string;
    setSelectedCategory: Dispatch<SetStateAction<string>>;
}