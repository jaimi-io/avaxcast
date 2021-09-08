import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "store";

// Use throughout app instead of plain `useDispatch` and `useSelector`

/**
 * Custom useSelector hook with type safety
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
/**
 * Custom useDispatch hook with type safety
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
