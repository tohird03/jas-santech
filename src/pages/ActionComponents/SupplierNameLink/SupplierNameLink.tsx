import React from 'react';
import {useNavigate} from 'react-router-dom';
import {ISupplierInfo} from '@/api/supplier/types';
import {ClipText} from '@/components/ClipText';
import {ROUTES} from '@/constants';

type Props = {
  supplier: ISupplierInfo;
  showPhone?: boolean;
  plain?: boolean;
  rowHover?: boolean;
  clip?: boolean;
};

export const SupplierNameLink = ({supplier, showPhone = true, plain = false, rowHover = false, clip = false}: Props) => {
  const navigate = useNavigate();
  const phone = supplier?.phone ? String(supplier.phone) : '';
  const phoneText = phone.startsWith('+') ? phone : `+${phone || '998000000000'}`;

  const handleReloadSingleClient = () => {
    navigate(ROUTES.supplierSingleSupplier.replace(':supplierId', String(supplier?.id)));
  };

  const fullname = supplier?.fullname || '';
  const nameClass = plain ? `person-link__name${clip ? ' cell-ellipsis' : ''}` : (clip ? 'cell-ellipsis' : undefined);
  const nameStyle = plain ? undefined : {margin: 0, fontWeight: 'bold'};
  const nameText = (
    <p className={nameClass} style={nameStyle} onClick={plain ? handleReloadSingleClient : undefined}>
      {fullname}
    </p>
  );
  const nameNode = fullname ? <ClipText text={fullname}>{nameText}</ClipText> : nameText;

  if (plain) {
    return (
      <div className={clip ? 'person-link person-link--pay name-clip clip-box' : 'person-link person-link--pay'}>
        {nameNode}
        {showPhone ? (
          clip ? (
            <ClipText text={phoneText}>
              <p className="person-link__phone cell-ellipsis">{phoneText}</p>
            </ClipText>
          ) : <p className="person-link__phone">{phoneText}</p>
        ) : null}
      </div>
    );
  }

  const linkClass = [
    'table-name-link',
    rowHover ? 'name-row-link' : '',
    clip ? 'name-clip clip-box' : '',
  ].filter(Boolean).join(' ');

  return (
    <div onClick={handleReloadSingleClient} className={linkClass}>
      {nameNode}
      {showPhone ? <i>{phoneText}</i> : null}
    </div>
  );
};
