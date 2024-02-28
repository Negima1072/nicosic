interface CSSModule {
    [className: string]: string;
}

declare module "*.module.css" {
    const styles: CSSModule;
    export default styles;
}

declare module "*.module.sass" {
    const styles: CSSModule;
    export default styles;
}

declare module "*.module.scss" {
    const styles: CSSModule;
    export default styles;
}
