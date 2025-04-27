export const cardStyles = {
  header: {
    backgroundColor: [99, 102, 241], // Indigo color
    height: 15,
    titleFontSize: 9,
    textColor: [255, 255, 255] // White
  },
  content: {
    labelFontSize: 9,
    textColor: [31, 41, 55], // Dark gray
    lineHeight: 5,
    startY: 22
  },
  website: {
    fontSize: 11, // Increased from 10 to 11
    textColor: [79, 70, 229], // Indigo color
    positionY: 50 // Slightly lower positioning
  },
  accessCode: {
    backgroundColor: [243, 244, 246], // Light gray
    fontSize: 10, // Increased from 9 to 10
    textColor: [31, 41, 55]
  },
  decorativeLine: {
    color: [99, 102, 241], // Indigo
    width: 0.5
  }
} as const;
