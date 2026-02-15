declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  >>;

  export default ReactComponent;
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.yml" {
  const value: any;
  export default value;
}

declare module "react-instagram-embed" {
  import * as React from "react";

  export interface InstagramEmbedProps {
    url: string;
    maxWidth?: number;
    hideCaption?: boolean;
    containerTagName?: string;
    protocol?: string;
    injectScript?: boolean;
    onLoading?: () => void;
    onSuccess?: (response: any) => void;
    onAfterRender?: () => void;
    onFailure?: (error: any) => void;
  }

  export default class InstagramEmbed extends React.Component<
    InstagramEmbedProps,
    any
  > {}
}
