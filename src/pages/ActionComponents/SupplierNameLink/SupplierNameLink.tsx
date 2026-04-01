import React from 'react';
import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { ISupplierInfo } from '@/api/supplier/types';

type Props = {
  supplier: ISupplierInfo;
};

export const SupplierNameLink = ({ supplier }: Props) => {
  const navigate = useNavigate();

  const handleReloadSingleClient = () => {
    navigate(ROUTES.supplierSingleSupplier.replace(':supplierId', String(supplier?.id)));
  };

  return (
    <div onClick={handleReloadSingleClient} style={{color: '#17a2b8', cursor: 'pointer'}}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>
        {supplier?.fullname}
      </p>
      <i>+{supplier?.phone}</i>
    </div>
  );
};
