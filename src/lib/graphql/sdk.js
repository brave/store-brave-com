import { GraphQLClient } from 'graphql-request';
import { getSdk } from '$lib/graphql/index.generated';
import { env } from '$env/dynamic/private';

const client = new GraphQLClient(`${env.API_URL}/api/graphql`);

export const sdk = getSdk(client);
