/**
 * Utility functions for handling AI suggestion field operations
 */

/**
 * Removes a specific suggestion from a comma-separated input string
 * Handles all comma scenarios: start, middle, end, and only item
 */
export const removeSuggestionFromInput = (
  currentInput: string,
  suggestionToRemove: string
): string => {
  if (!currentInput || !suggestionToRemove) return currentInput;

  // Escape special regex characters in the suggestion
  const escapedSuggestion = suggestionToRemove.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Define patterns for all comma scenarios
  const patterns = [
    new RegExp(`, *${escapedSuggestion} *,`, 'gi'), // middle: ", suggestion,"
    new RegExp(`^${escapedSuggestion} *, *`, 'gi'), // start: "suggestion, "
    new RegExp(`, *${escapedSuggestion} *$`, 'gi'), // end: ", suggestion"
    new RegExp(`^${escapedSuggestion} *$`, 'gi')    // only: "suggestion"
  ];

  let updatedInput = currentInput;
  
  // Apply patterns to remove the suggestion
  patterns.forEach((pattern, index) => {
    if (index === 0) {
      updatedInput = updatedInput.replace(pattern, ', '); // Replace middle with single comma
    } else {
      updatedInput = updatedInput.replace(pattern, ''); // Remove start, end, or only
    }
  });

  // Clean up any double commas or leading/trailing commas
  updatedInput = updatedInput
    .replace(/,\s*,/g, ',')                    // Remove double commas
    .replace(/^\s*,\s*|\s*,\s*$/g, '')         // Remove leading/trailing commas
    .trim();                                   // Clean whitespace

  return updatedInput;
};

/**
 * Adds a suggestion to a comma-separated input string
 */
export const addSuggestionToInput = (
  currentInput: string,
  suggestionToAdd: string
): string => {
  if (!suggestionToAdd) return currentInput;

  if (!currentInput || currentInput.trim() === '') {
    return suggestionToAdd;
  }

  return `${currentInput}, ${suggestionToAdd}`;
};

/**
 * Updates input field when an AI suggestion is toggled (selected/deselected)
 */
export const toggleSuggestionInInput = (
  currentInput: string,
  suggestion: string,
  isCurrentlySelected: boolean
): string => {
  if (isCurrentlySelected) {
    return removeSuggestionFromInput(currentInput, suggestion);
  } else {
    return addSuggestionToInput(currentInput, suggestion);
  }
};

/**
 * Enhanced AI suggestion input change handler that syncs selected options
 */
export const createAISuggestionInputHandler = <T extends Record<string, any>>(
  form: T,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  allAISuggestions: string[]
) => {
  return (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof T,
    selectedOptionsField: keyof T
  ) => {
    const { value } = e.target;
    
    // Update the input field value
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Parse the current input to see what options are still there
    const inputItems = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    const currentSelectedOptions = (form[selectedOptionsField] as string[]) || [];
    
    // Filter selected options to only include those still present in the input
    const updatedSelectedOptions = currentSelectedOptions.filter(option => 
      inputItems.includes(option)
    );
    
    // Update selected options if they've changed
    if (updatedSelectedOptions.length !== currentSelectedOptions.length) {
      setForm((prev) => ({
        ...prev,
        [selectedOptionsField]: updatedSelectedOptions,
      }));
    }
  };
};