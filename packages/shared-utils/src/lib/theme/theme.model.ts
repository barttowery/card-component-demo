export interface Theme {
  colors: {
    primary: string;
    text: {
      primary: string;
      secondary: string;
    };
    background: {
      base: string;
      hover: string;
    };
    border: string;
    focus: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    subtle: string;
    medium: string;
    focus: string;
  };
  borderRadius: string;
  transitions: string;
};
