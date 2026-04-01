import React from 'react';
import { IClientsInfo } from '@/api/clients';
import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';

type Props = {
  client: IClientsInfo;
};

export const ClientNameLink = ({ client }: Props) => {
  const navigate = useNavigate();

  const handleReloadSingleClient = () => {
    navigate(ROUTES.clientsSingleClient.replace(':clientId', String(client?.id)));
  };

  return (
    <div onClick={handleReloadSingleClient} style={{color: '#17a2b8', cursor: 'pointer'}}>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
        {client?.fullname}
      </p>
      <i>+{client?.phone}</i>
    </div>
  );
};
