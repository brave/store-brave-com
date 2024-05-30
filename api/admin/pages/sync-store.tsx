/** @jsxRuntime classic */
/** @jsx jsx */

import { useState } from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { jsx, Heading } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { ToastProvider, useToasts } from '@keystone-ui/toast';

export default function SyncStore() {
  const [isLoading, setLoading] = useState(false);
  const { addToast } = useToasts();

  async function sync() {
    setLoading(true);
    const response = await fetch('/rest/sync-store');
    if ((await response.json()).complete) {
      addToast({ title: 'Success!', message: 'Products synced from Printful.', tone: 'positive' });
    }
    setLoading(false);
  }

  return (
    <PageContainer header={<Heading type="h3">Sync Store</Heading>}>
      <h4>Sync with Printful</h4>
      <p>
        In order to sync latest changes from Printful to our store, you'll need to click the button
        below. This is a non-destructive operation.
      </p>
      <Button isLoading={isLoading} size="large" tone="active" weight="bold" onClick={sync}>
        Sync now
      </Button>

      <ToastProvider></ToastProvider>
    </PageContainer>
  );
}
