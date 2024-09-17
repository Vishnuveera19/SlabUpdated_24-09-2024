import { useLayoutEffect, useEffect } from 'react';

export const useRestoreCursorPosition = (inputRef, cursorPosition) => {
  useEffect(() => {
    if (inputRef.current && cursorPosition !== null) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, inputRef]);
};