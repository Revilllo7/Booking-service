import axios from 'axios';

async function getAdminToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', 'admin-cli');
  params.append('username', 'admin'); // from docker-compose
  params.append('password', 'admin'); // from docker-compose

  interface TokenResponse {
    access_token: string;
    [key: string]: any;
  }

  const response = await axios.post<TokenResponse>(
    'http://keycloak:8080/realms/master/protocol/openid-connect/token',
    params
  );
  return response.data.access_token;
}

interface KeycloakUserResponse {
  username?: string;
  preferredUsername?: string;
  name?: string;
  [key: string]: any;
}

export async function getUsernameFromKeycloak(userId: string): Promise<string | null> {
  const adminToken = await getAdminToken();
  const response = await axios.get<KeycloakUserResponse>(
    `http://keycloak:8080/admin/realms/booking-app/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  return response.data.username || response.data.preferredUsername || null;
}