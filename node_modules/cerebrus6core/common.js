function formatString(inputString) {
  // Step 1: Split the input string by commas
  const elements = inputString.split(',');

  // Step 2: Trim whitespace for each element and remove double quotes
  const cleanedElements = elements.map((element) => {
    // Trim whitespace
    const trimmed = element.trim();
    // Remove double quotes
    return trimmed.replace(/"/g, '');
  });

  // Step 3: Surround each element with double quotes
  // const quotedElements = cleanedElements.map((element) => `"${element}"`);

  // Step 4: Join the elements into a comma-separated string
  const resultString = cleanedElements.join(',');

  return resultString;
}

function currentDateTime() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = {
    formatString,
    currentDateTime,
};