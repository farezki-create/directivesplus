
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
  accessCode: {
    backgroundColor: [243, 244, 246], // Light gray
    fontSize: 9,
    textColor: [31, 41, 55]
  },
  website: {
    fontSize: 10, // Increased font size
    textColor: [79, 70, 229] // Indigo
  },
  decorativeLine: {
    color: [99, 102, 241], // Indigo
    width: 0.5
  }
} as const;
