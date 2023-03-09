/** @jsxRuntime classic */
/** @jsx jsx */

import { useState } from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { jsx, Heading, Stack, Box } from "@keystone-ui/core";
import { Button } from "@keystone-ui/button";
import { TextInput, FieldContainer, FieldLabel } from "@keystone-ui/fields"
import { decrypt } from "../../utils/index";
import { ToastProvider, useToasts } from "@keystone-ui/toast";

export default function DecryptRecipient() {
  const [isLoading, setLoading] = useState(false);
  const [keyId, setKeyId] = useState("");
  const [encryptedString, setEncryptedString] = useState("");
  const [decryptedString, setDecryptedString] = useState(null as object|null);
  const { addToast } = useToasts();

  async function decryptString() {
    if (keyId && encryptedString) {
      setLoading(true);
      const response = await fetch("/rest/keys/" + keyId);
      const respBody = await response.json();

      if (response.status === 200 && respBody.key) {
        try {
          const decrypted = decrypt(encryptedString, respBody.key);
          setDecryptedString(decrypted);
        } catch (e) {
          addToast({ title: "Error", message: "Could not decrypt string.", tone: "negative" });
        }
      }
      setLoading(false);
    }
  }

  return (
    <PageContainer header={<Heading type="h3">Decrypt recipient</Heading>}>
      <h4>Decrypt recipient info</h4>
      <p>To inspect recipient info provided to stripe, please paste the keyId and encrypted recipient string in the boxes below.</p>
      <Stack width="100%" gap="large">
        <FieldContainer>
          <FieldLabel>Key ID</FieldLabel>
          <TextInput value={keyId} onChange={e => setKeyId(e.target.value)} />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Encrypted recipient string</FieldLabel>
          <TextInput value={encryptedString} onChange={e => setEncryptedString(e.target.value)} />
        </FieldContainer>
        <Button isDisabled={!keyId || !encryptedString} isLoading={isLoading} size='medium' tone='active' weight='bold' onClick={decryptString}>Decrypt</Button>
        {decryptedString && <Box background="neutral100" padding="medium" rounding="medium"><pre><code>{JSON.stringify(decryptedString, null, 2)}</code></pre></Box>}
      </Stack>

      <ToastProvider>
      </ToastProvider>
    </PageContainer>
  );
}