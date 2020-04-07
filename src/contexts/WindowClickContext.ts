import { createContext } from 'react';
import { Observable, of } from 'rxjs';

export interface WindowClickContextType {
  stream: Observable<any>;
}

export const WindowClickContext = createContext<WindowClickContextType>({ stream: of(null) });
