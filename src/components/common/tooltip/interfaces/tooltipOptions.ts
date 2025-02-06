export default interface TooltipOptions {
    option: string;
    action?: () => void;
    icon: {
        src: string;
        width: number;
        height: number;
    }
}