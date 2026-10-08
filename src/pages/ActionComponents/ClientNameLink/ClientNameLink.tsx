import React from 'react';
import { IClientsInfo } from '@/api/clients';
import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';

type Props = {
  client: IClientsInfo;
  plain?: boolean;
};

export const ClientNameLink = ({ client, plain = false }: Props) => {
  const navigate = useNavigate();
  const phone = client?.phone ? String(client.phone) : '';
  const phoneText = phone.startsWith('+') ? phone : `+${phone || '998000000000'}`;

  const handleReloadSingleClient = () => {
    navigate(ROUTES.clientsSingleClient.replace(':clientId', String(client?.id)));
  };

  if (plain) {
    return (
      <div onClick={handleReloadSingleClient} className="person-link">
        <p className="person-link__name">{client?.fullname}</p>
        <p className="person-link__phone">{phoneText}</p>
      </div>
    );
  }

  return (
    <div onClick={handleReloadSingleClient} className="table-name-link">
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
        {client?.fullname}
      </p>
    </div>
  );
};
