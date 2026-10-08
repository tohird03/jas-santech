import React from 'react';
import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { ISupplierInfo } from '@/api/supplier/types';

type Props = {
  supplier: ISupplierInfo;
  showPhone?: boolean;
  plain?: boolean;
};

export const SupplierNameLink = ({ supplier, showPhone = true, plain = false }: Props) => {
  const navigate = useNavigate();
  const phone = supplier?.phone ? String(supplier.phone) : '';
  const phoneText = phone.startsWith('+') ? phone : `+${phone || '998000000000'}`;

  const handleReloadSingleClient = () => {
    navigate(ROUTES.supplierSingleSupplier.replace(':supplierId', String(supplier?.id)));
  };

  if (plain) {
    return (
      <div onClick={handleReloadSingleClient} className="person-link">
        <p className="person-link__name">{supplier?.fullname}</p>
        {showPhone ? <p className="person-link__phone">{phoneText}</p> : null}
      </div>
    );
  }

  return (
    <div onClick={handleReloadSingleClient} className="table-name-link">
      <p style={{ margin: 0, fontWeight: 'bold' }}>
        {supplier?.fullname}
      </p>
      {showPhone ? <i>{phoneText}</i> : null}
    </div>
  );
};
