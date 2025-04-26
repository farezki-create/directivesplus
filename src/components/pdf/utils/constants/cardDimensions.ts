
// Standard credit card dimensions and layout constants
export const cardDimensions = {
  width: 85.6, // mm
  height: 53.98, // mm
  margins: {
    outer: 2,
    header: 7,
    contentStartY: 12,
    lineSpacing: 5
  }
} as const;

export const pageLayout = {
  width: 210, // A4 width in mm
  height: 297, // A4 height in mm
  margin: (210 - (cardDimensions.width * 2)) / 3, // Dynamic margin calculation
  cardsStartY: 100 // Y position where cards start
} as const;
