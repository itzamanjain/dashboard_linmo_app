import { RefObject } from "react";

import TooltipOptions from "./tooltipOptions";

export default interface TooltipProps {
    options: TooltipOptions[];
    showTooltip: boolean;
    tooltipRef: RefObject<HTMLDivElement>;
}