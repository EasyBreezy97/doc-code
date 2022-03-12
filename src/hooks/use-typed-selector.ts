import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";
useSelector;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
