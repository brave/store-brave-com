import { GraphQLClient } from 'graphql-request';
import { getSdk } from '$lib/graphql/index.generated';
import { API_URL } from '$app/env/private';
import { building } from '$app/env';

const client = new GraphQLClient(`${!building && API_URL}/api/graphql`);

export const sdk = getSdk(client);
