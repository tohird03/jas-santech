import React from 'react';
import { Tooltip } from 'antd';
import { IClientsInfo } from '@/api/clients';
import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';

type Props = {
  client: Pick<IClientsInfo, 'id' | 'fullname'> & {phone?: string | null};
  plain?: boolean;
  rowHover?: boolean;
  centered?: boolean;
  clip?: boolean;
};

export const ClientNameLink = ({ client, plain = false, rowHover = false, centered = false, clip = false }: Props) => {
  const navigate = useNavigate();
  const phone = client?.phone ? String(client.phone).trim() : '';
  const phoneText = phone ? (phone.startsWith('+') ? phone : `+${phone}`) : '';
  const fullname = client?.fullname || '';

  const handleReloadSingleClient = () => {
    navigate(ROUTES.clientsSingleClient.replace(':clientId', String(client?.id)));
  };

  const nameClass = plain ? `person-link__name${clip ? ' cell-ellipsis' : ''}` : (clip ? 'cell-ellipsis' : undefined);
  const nameStyle = plain ? undefined : { margin: 0, fontWeight: 'bold', fontSize: '14px' };
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
    const plainClass = [
      'person-link person-link--pay',
      centered ? 'person-link--center' : '',
      clip ? 'name-clip' : '',
    ].filter(Boolean).join(' ');

    return (
      <div className={plainClass}>
        {nameNode}
        {phoneText ? <p className={clip ? 'person-link__phone cell-ellipsis' : 'person-link__phone'}>{phoneText}</p> : null}
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
    </div>
  );
};
