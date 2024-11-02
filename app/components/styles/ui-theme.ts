import { createColorPalette } from "./color-palette";

// export default {
//   colors: {
//     transparent: "transparent",
//     black: "#000",
//     white: "#fff",
//     gray: {
//       50: "#f7fafc",
//       // ...
//       900: "#1a202c",
//     },
//     // ...
//   },
// };

interface ThemeColor {
  [key: string]: any;

  /**
   * Background color for filled elements that sit on top of the body.
   * (cards, panel, modal...)
   * @default #FFFFF
   */
  surface?: string;
  /**
   * Base color for the site. Text and all elements that are not colored.
   * @default #443F3F
   */
  base?: string;
  /**
   * Primary color.
   * @default #CF3F02
   */
  primary?: string;
  /**
   * Secondary color.
   * @default #E2C044
   */
  secondary?: string;
  /**
   * State color: danger
   * @default #A71D31
   */
  danger?: string;
  /**
   * State color: warning
   * @default #E2C044
   */
  warning?: string;
  /**
   * State color: success
   * @default #4DA167
   */
  success?: string;
  /**
   * State color: info
   * @default #2E86AB
   */
  info?: string;

  // Color palettes
  // For each color above a palette with darker/lighter colors is generated.

  /**
   * Only used for body background color. Uses surface if not provided.
   * @default $.color.surface
   */
  background?: string;
  /**
   * Color for links. Uses primary if not defined.
   * @default $.color.primary
   */
  link?: string;
}

interface ThemeTypeBase {
  [key: string]: any;

  /**
   * <@default $.type.base.family
   */
  family?: string;
  /**
   * @default $.type.base.style
   */
  style?: string;
  /**
   * @default $.type.base.settings
   */
  settings?: string;
  /**
   * @default $.type.base.case
   */
  case?: string;
  /**
   * @default $.type.base.light
   */
  light?: string;
  /**
   * @default $.type.base.regular
   */
  regular?: string;
  /**
   * @default $.type.base.medium
   */
  medium?: string;
  /**
   * @default $.type.base.bold
   */
  bold?: string;
  /**
   * @default $.type.base.bold
   */
  weight?: string;
  /**
   * @default none
   */
  textTransform?: string;
}

interface ThemeType {
  [key: string]: any;

  /**
   * Base type settings for the site.
   */
  base?: Omit<ThemeTypeBase, "textTransform"> & {
    size?: string;
    /**
     * Uses 1.5 times the size when not provided
     * @default "$.color.base * 1.5"
     */
    leadSize?: string;
    line?: string;
    /**
     * Uses the base color when not provided.
     * @default $.color.base
     */
    color?: string;
    antialiasing?: number;
  };

  /**
   * Heading type definition. When not provided the same settings as base
   * type are used.
   */
  heading?: ThemeTypeBase;

  /**
   * Overline type definition. When not provided the same settings as base
   * type are used.
   */
  overline?: Omit<ThemeTypeBase, "textTransform"> & {
    /**
     * @default uppercase
     */
    textTransform?: string;
  };
}

interface ThemeShape {
  [key: string]: any;

  /**
   * @default 0.25rem
   */
  rounded?: string;
  /**
   * @default 320rem
   */
  ellipsoid?: string;
}

interface ThemeLayout {
  [key: string]: any;

  /**
   * @default 1rem
   */
  space?: string;
  /**
   * @default 1px
   */
  border?: string;
  /**
   * @default 320px
   */
  min?: string;
  /**
   * @default 1280px
   */
  max?: string;
}

interface ThemeButton {
  [key: string]: any;

  /**
   * Button type definition. When not provided the same settings as base
   * type are used.
   */
  type?: {
    [key: string]: any;

    family?: string;
    style?: string;
    settings?: string;
    case?: string;
    weight?: string;
  };

  /**
   * Button shape definition. When not provided the same settings as shape
   * type are used.
   */
  shape?: {
    [key: string]: any;

    border?: string;
    rounded?: string;
  };
}

interface ThemeBoxShadow {
  [key: string]: any;

  /**
   * @default "inset 0px 0px 3px 0px {color base-50a}"
   */
  inset?: string;
  /**
   * @default "0 -1px 1px 0 {color base-100a}, 0 2px 6px 0 {color base-200a}"
   */
  input?: string;
  /**
   * @default "0 0 4px 0 {color base-100a}, 0 2px 2px 0 {color base-100a}"
   */
  elevationA?: string;
  /**
   * @default "0 0 4px 0 {color base-100a}, 0 4px 4px 0 {color base-100a}"
   */
  elevationB?: string;
  /**
   * @default "0 0 4px 0 {color base-100a}, 0 8px 12px 0 {color base-100a}"
   */
  elevationC?: string;
  /**
   * @default "0 0 4px 0 {color base-100a}, 0 12px 24px 0 {color base-100a}"
   */
  elevationD?: string;
}

interface ThemeMediaRanges {
  xsmall?: [null, number];
  small?: [number, number];
  medium?: [number, number];
  large?: [number, number];
  xlarge?: [number, null];
}

interface Theme {
  [key: string]: any;

  /**
   * Base theme colors. These will serve as base for all other elements, but
   * they can be overridden on an individual basis.
   */
  color?: ThemeColor;
  /**
   * Typography definition
   */
  type?: ThemeType;
  /**
   * Values for shapes.
   */
  shape?: ThemeShape;
  /**
   * Values for layout settings.
   */
  layout?: ThemeLayout;
  /**
   * Button specific settings.
   */
  button?: ThemeButton;
  /**
   * Box shadow definitions for different elevation effects.
   */
  boxShadow?: ThemeBoxShadow;
  /**
   * Ranges for media queries.
   * @default {ThemeMediaRanges} Each range spans 224px:
   *   xsmall = [null, 543],
   *   small = [544, 767],
   *   medium = [768, 991],
   *   large = [992, 1215],
   *   xlarge = [1216, null]
   */
  mediaRanges?: ThemeMediaRanges;
}

/**
 * Creates a UI theme by combining the provided options with the default ones.
 * When an override for a value is provided, it gets propagated to all the
 * variables that use that value. For example: The primary color will be used
 * for links unless a color for "link" is provided.
 *
 * @param {DevseedUITheme} definition The theme definition
 *
 * @returns DevseedUITheme
 */
export function createUITheme(definition = {}) {
  const {
    color = {},
    type = {},
    shape = {},
    layout = {},
    button = {},
    boxShadow = {},
    mediaRanges = {},
    ...customDefinition
  } = definition;

  const {
    surface = "#FFFFFF",
    base = "#443F3F",
    primary = "#CF3F02",
    secondary = "#E2C044",
    danger = "#A71D31",
    warning = "#E2C044",
    success = "#4DA167",
    info = "#2E86AB",
    background,
    link,
    ...customColors
  } = color;

  const colorScales = {
    ...createColorPalette("base", base),
    ...createColorPalette("surface", surface),
    ...createColorPalette("primary", primary),
    ...createColorPalette("secondary", secondary),
    ...createColorPalette("danger", danger),
    ...createColorPalette("warning", warning),
    ...createColorPalette("success", success),
    ...createColorPalette("info", info),
  };

  const {
    base: typeBase = {},
    heading: typeHeading = {},
    overline: typeOverline = {},
    ...customType
  } = type;

  const {
    size: typeBaseSize = "1rem",
    line: typeBaseLine = "calc(0.5rem + 1em)",
    color: typeBaseColor = base,
    family: typeBaseFamily = '"Open Sans", sans-serif',
    style: typeBaseStyle = "normal",
    settings: typeBaseSettings = "'pnum' 0",
    case: typeBaseCase = "none",
    light: typeBaseLight = 300,
    regular: typeBaseRegular = 400,
    medium: typeBaseMedium = 600,
    bold: typeBaseBold = 700,
    weight: typeBaseWeight = 300,
    antialiasing: typeBaseAntialiasing = true,
    ...customTypeBase
  } = typeBase;

  const { leadSize: typeLeadSize = `calc(${typeBaseSize} * 1.5)` } = typeBase;

  const {
    family: typeHeadingFamily = typeBaseFamily,
    style: typeHeadingStyle = typeBaseStyle,
    settings: typeHeadingSettings = '"wdth" 80, "wght" 780',
    case: typeHeadingCase = typeBaseCase,
    light: typeHeadingLight = typeBaseLight,
    regular: typeHeadingRegular = typeBaseRegular,
    medium: typeHeadingMedium = typeBaseMedium,
    bold: typeHeadingBold = typeBaseBold,
    weight: typeHeadingWeight = typeBaseBold,
    textTransform: typeHeadingTextTransform = "none",
    ...customTypeHeading
  } = typeHeading;

  const {
    family: typeOverlineFamily = typeBaseFamily,
    style: typeOverlineStyle = typeBaseStyle,
    settings: typeOverlineSettings = typeBaseSettings,
    case: typeOverlineCase = typeBaseCase,
    light: typeOverlineLight = typeBaseLight,
    regular: typeOverlineRegular = typeBaseRegular,
    medium: typeOverlineMedium = typeBaseMedium,
    bold: typeOverlineBold = typeBaseBold,
    weight: typeOverlineWeight = typeBaseBold,
    textTransform: typeOverlineTextTransform = "uppercase",
    ...customTypeOverline
  } = typeOverline;

  const { rounded = "0.25rem", ellipsoid = "320rem", ...customShape } = shape;

  const {
    space = "1rem",
    border = "1px",
    min = "320px",
    max = "1280px",
    ...customLayout
  } = layout;

  const {
    type: buttonType = {},
    shape: buttonShape = {},
    ...customButton
  } = button;

  const {
    family: buttonTypeFamily = typeBaseFamily,
    style: buttonTypeStyle = typeBaseStyle,
    settings: buttonTypeSettings = typeBaseSettings,
    case: buttonTypeCase = typeBaseCase,
    weight: buttonTypeWeight = typeBaseBold,
    ...customButtonType
  } = buttonType;

  const {
    border: buttonShapeBorder = border,
    rounded: buttonShapeRounded = rounded,
    ...customButtonShape
  } = buttonShape;

  const {
    inset = `inset 0px 0px 3px 0px ${colorScales["base-50a"]};`,
    input = `0 -1px 1px 0 ${colorScales["base-100a"]}, 0 2px 6px 0 ${colorScales["base-200a"]};`,
    elevationA = `0 0 4px 0 ${colorScales["base-100a"]}, 0 2px 2px 0 ${colorScales["base-100a"]};`,
    elevationB = `0 0 4px 0 ${colorScales["base-100a"]}, 0 4px 4px 0 ${colorScales["base-100a"]};`,
    elevationC = `0 0 4px 0 ${colorScales["base-100a"]}, 0 8px 12px 0 ${colorScales["base-100a"]};`,
    elevationD = `0 0 4px 0 ${colorScales["base-100a"]}, 0 12px 24px 0 ${colorScales["base-100a"]};`,
    ...customBoxShadow
  } = boxShadow;

  const {
    xsmall = [null, 543],
    small = [544, 767],
    medium = [768, 991],
    large = [992, 1215],
    xlarge = [1216, null],
  } = mediaRanges;

  //
  // Theme object definition
  return {
    ...customDefinition,
    color: {
      // base color for the site. Text and all elements that are not colored.
      // required
      base,

      // Background color for filled elements that sit on top of the body.
      // (cards, panel, modal...)
      // required
      surface,

      // required
      primary,
      // required
      secondary,

      // States colors
      // required
      danger,
      // required
      warning,
      // required
      success,
      // required
      info,

      // Only used for body color. Uses surface if not provided.
      background: background || surface,
      // Color for links. Uses primary if not defined
      link: link || primary,

      // User defined colors which may include scales.
      ...customColors,

      // Scales
      ...colorScales,
    },
    type: {
      base: {
        size: typeBaseSize,
        leadSize: typeLeadSize,
        line: typeBaseLine,
        color: typeBaseColor,
        family: typeBaseFamily,
        style: typeBaseStyle,
        settings: typeBaseSettings,
        case: typeBaseCase,
        light: typeBaseLight,
        regular: typeBaseRegular,
        medium: typeBaseMedium,
        bold: typeBaseBold,
        weight: typeBaseWeight,
        antialiasing: typeBaseAntialiasing,
        ...customTypeBase,
      },
      heading: {
        family: typeHeadingFamily,
        style: typeHeadingStyle,
        settings: typeHeadingSettings,
        case: typeHeadingCase,
        light: typeHeadingLight,
        regular: typeHeadingRegular,
        medium: typeHeadingMedium,
        bold: typeHeadingBold,
        weight: typeHeadingWeight,
        textTransform: typeHeadingTextTransform,
        ...customTypeHeading,
      },
      overline: {
        family: typeOverlineFamily,
        style: typeOverlineStyle,
        settings: typeOverlineSettings,
        case: typeOverlineCase,
        light: typeOverlineLight,
        regular: typeOverlineRegular,
        medium: typeOverlineMedium,
        bold: typeOverlineBold,
        weight: typeOverlineWeight,
        textTransform: typeOverlineTextTransform,
        ...customTypeOverline,
      },
      ...customType,
    },
    shape: {
      rounded,
      ellipsoid,
      ...customShape,
    },
    layout: {
      space,
      border,
      min,
      max,
      ...customLayout,
    },
    button: {
      type: {
        family: buttonTypeFamily,
        style: buttonTypeStyle,
        settings: buttonTypeSettings,
        case: buttonTypeCase,
        weight: buttonTypeWeight,
        ...customButtonType,
      },
      shape: {
        border: buttonShapeBorder,
        rounded: buttonShapeRounded,
        ...customButtonShape,
      },
      ...customButton,
    },
    boxShadow: {
      inset,
      input,
      elevationA,
      elevationB,
      elevationC,
      elevationD,
      ...customBoxShadow,
    },
    mediaRanges: {
      xsmall,
      small,
      medium,
      large,
      xlarge,
    },
  };
}

export const theme = {
  main: createUITheme(),
};
