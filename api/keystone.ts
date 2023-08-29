/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from '@keystone-6/core';

const { DB_URL } = process.env;

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
import { lists } from './schema';

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from './auth';

import type { Request, Response } from 'express';
import type { Context } from '.keystone/types';
import { seedDB } from './seed';
import { syncStore } from './routes/syncStore';
import { purgeOldShippingDataKeys } from './utils';

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: 'postgresql',
      useMigrations: true,
      url: `postgresql://${DB_URL}/keystone?connect_timeout=10`,
      onConnect: async (context) => {
        if (process.argv.includes('--seed-db')) {
          seedDB(context);
        }

        // Immediately purge shipping data keys that are 7 days old or older
        purgeOldShippingDataKeys(context);

        // Set interval to purge shipping data keys daily
        const purgeInterval = 1 * 86_400_000;
        setInterval(() => purgeOldShippingDataKeys(context), purgeInterval);
      }
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data
    },
    lists,
    session,
    server: {
      extendExpressApp: (app, commonContext) => {
        app.use('/rest', async (req, res, next) => {
          (req as any).context = await commonContext.withRequest(req, res);
          next();
        });

        app.get('/rest/sync-store', syncStore);

        app.get('/rest/keys/:keyId', async (req: Request, res: Response) => {
          const { context } = req as typeof req & { context: Context };
          const { keyId } = req.params;

          const validCUIDPattern = /^c[0-9a-z]{6,}$/;
          if (keyId && validCUIDPattern.test(keyId)) {
            const keyItem = await context.db.ShippingDataKey.findOne({ where: { id: keyId } });

            if (keyItem) {
              return res.json({ key: keyItem.key });
            }
          }

          res.status(400).json({ message: "Could not find key. Please try a different ID." })
        });
      }
    },
    telemetry: false
  })
);
