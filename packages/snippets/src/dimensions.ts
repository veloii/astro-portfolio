export type AnyDimensions =
  | { width: number; height: number; aspectRatio?: undefined }
  | { width: number; aspectRatio: number; height?: undefined }
  | { height: number; aspectRatio: number; width?: undefined };

export type SizeDimensions = { width: number; height: number };

export function sizeDimensions(dimensions: AnyDimensions): SizeDimensions {
  if (dimensions.aspectRatio !== undefined) {
    if (dimensions.width !== undefined) {
      return {
        width: dimensions.width,
        height: Math.ceil(dimensions.width * dimensions.aspectRatio),
      };
    }

    if (dimensions.height !== undefined) {
      return {
        height: dimensions.height,
        width: Math.ceil(dimensions.height * dimensions.aspectRatio),
      };
    }
  }

  return dimensions;
}
