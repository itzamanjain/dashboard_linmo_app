import { memo } from "react";

import CategoriesProps from "./interfaces/categoriesProps";

const categories: string[] = [
    "Alpine",
    "Barrefit",
    "Beach Volley",
    "BMX",
    "Boxing",
    "Bouldering",
    "Calisthenics",
    "City Cycling",
    "Climbing",
    "Fitness",
    "Golf",
    "Hiking",
    "Inline Skate",
    "Mountain Bike",
    "Padel",
    "Parkour",
    "Paddle Surf",
    "Road Cycling",
    "Roller Skate",
    "Running",
    "Skiing",
    "Skateboarding",
    "Snowboard",
    "Surf",
    "Surf Skate",
    "Swimming",
    "Tennis",
    "Trail Running",
    "Wellness",
    "Yoga"
].sort();

const Categories = (props: CategoriesProps) => {
    const { selectedCategory, setSelectedCategory } = props;

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };
    return (
        <div className="flex flex-wrap items-center gap-3">
            {categories.map((category, index) => {
                const activeCategory = selectedCategory === category;
                return (
                    <div
                        key={index}
                        className={`border rounded-full px-4 py-2 cursor-pointer
                            ${activeCategory ? 'bg-olive' : 'bg-black'}
                            ${activeCategory ? 'border-green' : 'border-darkMetal'}`}
                        onClick={() => handleCategorySelect(category)}
                    >
                        <h3
                            className={`font-normal text-sm leading-custom-22
                                ${activeCategory ? 'text-yellowyGreen' : 'text-white'}`}
                        >
                            {category}
                        </h3>
                    </div>
                );
            })}
        </div>
    );
};

export default memo(Categories);