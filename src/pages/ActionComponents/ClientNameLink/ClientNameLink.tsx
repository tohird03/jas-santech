import React from 'react';
import { IClientsInfo } from '@/api/clients';
import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';

type Props = {
  client: Pick<IClientsInfo, 'id' | 'fullname'> & {phone?: string | null};
  plain?: boolean;
  rowHover?: boolean;
  centered?: boolean;
};

export const ClientNameLink = ({ client, plain = false, rowHover = false, centered = false }: Props) => {
  const navigate = useNavigate();
  const phone = client?.phone ? String(client.phone).trim() : '';
  const phoneText = phone ? (phone.startsWith('+') ? phone : `+${phone}`) : '';

  const handleReloadSingleClient = () => {
    navigate(ROUTES.clientsSingleClient.replace(':clientId', String(client?.id)));
  };

  if (plain) {
    return (
      <div className={`person-link person-link--pay${centered ? ' person-link--center' : ''}`}>
        <p className="person-link__name" onClick={handleReloadSingleClient}>{client?.fullname}</p>
        {phoneText ? <p className="person-link__phone">{phoneText}</p> : null}
      </div>
    );
  }

  return (
    <div onClick={handleReloadSingleClient} className={rowHover ? 'table-name-link name-row-link' : 'table-name-link'}>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
        {client?.fullname}
      </p>
    </div>
  );
};
