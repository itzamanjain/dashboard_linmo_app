export default interface TooltipOptions {
    option: string;
    action?: (type: "one" | "all" | null) => void;
    icon: {
        src: string;
        width: number;
        height: number;
    }
}
