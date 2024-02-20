import { GraphQLClient } from 'graphql-request';
import { getSdk } from '$lib/graphql/index.generated';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

const client = new GraphQLClient(`${!building && env.API_URL}/api/graphql`);

export const sdk = getSdk(client);
