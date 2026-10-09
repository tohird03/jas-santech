import React from 'react';
import { Tooltip } from 'antd';
import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';
import { ISupplierInfo } from '@/api/supplier/types';

type Props = {
  supplier: ISupplierInfo;
  showPhone?: boolean;
  plain?: boolean;
  rowHover?: boolean;
  clip?: boolean;
};

export const SupplierNameLink = ({ supplier, showPhone = true, plain = false, rowHover = false, clip = false }: Props) => {
  const navigate = useNavigate();
  const phone = supplier?.phone ? String(supplier.phone) : '';
  const phoneText = phone.startsWith('+') ? phone : `+${phone || '998000000000'}`;

  const handleReloadSingleClient = () => {
    navigate(ROUTES.supplierSingleSupplier.replace(':supplierId', String(supplier?.id)));
  };

  const fullname = supplier?.fullname || '';
  const nameClass = plain ? `person-link__name${clip ? ' cell-ellipsis' : ''}` : (clip ? 'cell-ellipsis' : undefined);
  const nameStyle = plain ? undefined : { margin: 0, fontWeight: 'bold' };
  const nameText = (
    <p className={nameClass} style={nameStyle} onClick={plain ? handleReloadSingleClient : undefined}>
      {fullname}
    </p>
  );
  const nameNode = clip ? (
    <Tooltip title={fullname} placement="topLeft">
      {nameText}
    </Tooltip>
  ) : nameText;

  if (plain) {
    return (
      <div className={clip ? 'person-link person-link--pay name-clip' : 'person-link person-link--pay'}>
        {nameNode}
        {showPhone ? <p className={clip ? 'person-link__phone cell-ellipsis' : 'person-link__phone'}>{phoneText}</p> : null}
      </div>
    );
  }

  const linkClass = [
    'table-name-link',
    rowHover ? 'name-row-link' : '',
    clip ? 'name-clip' : '',
  ].filter(Boolean).join(' ');

  return (
    <div onClick={handleReloadSingleClient} className={linkClass}>
      {nameNode}
      {showPhone ? <i>{phoneText}</i> : null}
    </div>
  );
};
