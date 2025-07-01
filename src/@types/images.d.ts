/* image module */
declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.jpeg' {
  const value: string;
  export default value;
}
declare module '*.jpg' {
  const value: string;
  export default value;
}

/* svg component */
declare module '*.svg' {
  import React from 'react';

  export const ReactComponent: React.FC<React.SVGProps<SVGElement>>;

  export default ReactComponent;
}
