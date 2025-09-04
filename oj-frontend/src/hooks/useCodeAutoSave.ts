import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook to automatically save code to localStorage at specified intervals
 * @param key - Unique storage key
 * @param value - The code value to save
 * @param intervalMs - Interval in milliseconds (default: 30000ms = 30 seconds)
 * @param showToast - Whether to show toast notifications on save (default: true)
 */
export default function useCodeAutoSave(
  key: string,
  value: string,
  intervalMs: number = 30000,
  showToast: boolean = true
) {
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedContentRef = useRef<string>('');
  
  // Save function
  const saveToLocalStorage = () => {
    if (value && value !== lastSavedContentRef.current) {
      try {
        localStorage.setItem(key, value);
        lastSavedContentRef.current = value;
        
        if (showToast) {
          toast.success('代码已自动保存', {
            duration: 1500,
            position: 'bottom-right'
          });
        }
      } catch (error) {
        console.error('Failed to auto-save code:', error);
        if (showToast) {
          toast.error('自动保存失败', {
            duration: 2000,
            position: 'bottom-right'
          });
        }
      }
    }
    
    // Clear the timeout and set a new one
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(saveToLocalStorage, intervalMs);
  };
  
  // Initialize with the current value
  useEffect(() => {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      lastSavedContentRef.current = savedValue;
    }
    
    // Set initial timeout
    saveTimeoutRef.current = setTimeout(saveToLocalStorage, intervalMs);
    
    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Save one last time when component unmounts
      saveToLocalStorage();
    };
  }, [key, intervalMs, showToast]);
  
  // Return manual save function
  return {
    manualSave: saveToLocalStorage
  };
}