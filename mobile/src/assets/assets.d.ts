declare module "*.png"

declare module "*.svg" {
    import react from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.Fc<SvgProps>;
    export default content;
}