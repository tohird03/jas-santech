import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {ROUTES} from '@/constants';

type Props = {
  isAuth: boolean | null;
};

export const PublicRoutes=({isAuth}: Props) => isAuth
  ? <Navigate to={ROUTES.productsOrder} />
  : <Outlet />;
