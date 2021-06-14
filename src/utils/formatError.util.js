const unknownErrorText = 'Could not perform operation';

const formatError = (error, text = unknownErrorText) => {
  const errorMessage = error?.message;
  return `${text}${errorMessage ? `: ${errorMessage}` : ''}`;
};

export default formatError;
