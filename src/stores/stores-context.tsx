import React, {useContext} from 'react';
import {stores} from './stores';

const storesContext = React.createContext(stores);

export const useStores = () => useContext<typeof stores>(storesContext);
