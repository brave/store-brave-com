# Brave Merch Store

## Frontend

### Build

```bash
npm install && npm run build
```

### Start

```bash
npm run start
```

You'll need the following environment variables:

```
BASE_URL=/* environment specific domain for store frontend */
PUBLIC_ASSETS_PATH=/* public URL to images S3 bucket e.g. https://cdn.store.brave.com */
API_URL=/* url (not including the path) where GraphQL api can be found */
PRINTFUL_API_TOKEN=/* api token from printful */
PRINTFUL_BASE_URL=https://api.printful.com
PRINTFUL_STORE_ID=/* store id from printful */
STRIPE_KEY=/* key for making requests to Stripe */
STRIPE_WEBHOOK_SECRET=/* key for making listening to Stripe webhooks */
SENTRY_DSN=/* DSN for Sentry alerts */
```

## API

### Build

```bash
cd api && npm install && npm run build
```

### Start

```bash
npm run start
```

You'll need the following environment variables:

```
SESSION_SECRET=/* 32 character code */
DB_URL=/* db url, e.g. localhost:5432 */
S3_IMAGES_BUCKET=/* bucket name from s3 */
PUBLIC_ASSETS_PATH=/* public URL to images S3 bucket e.g. https://cdn.store.brave.com */
PRINTFUL_API_TOKEN=/* api token from printful */
PRINTFUL_BASE_URL=https://api.printful.com
PRINTFUL_STORE_ID=/* store id from printful */
SENTRY_DSN=/* DSN for Sentry alerts */
```
