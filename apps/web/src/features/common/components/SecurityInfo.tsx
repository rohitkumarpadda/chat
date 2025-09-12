import { Alert, Text, List } from "@mantine/core";
import { Shield } from "tabler-icons-react";

export const SecurityInfo = () => {
  return (
    <Alert
      icon={<Shield size={16} />}
      title="Enhanced Privacy & Security"
      color="blue"
      variant="light"
      className="mb-4"
    >
      <Text size="sm">
        This chat application uses enhanced privacy features:
      </Text>
      <List size="sm" className="mt-2">
        <List.Item>
          <strong>Exact Username Search:</strong> You must know the exact username to find users
        </List.Item>
        <List.Item>
          <strong>Public Key Verification:</strong> The receiver&apos;s public key is required to start conversations
        </List.Item>
        <List.Item>
          <strong>No User Browsing:</strong> You cannot see a list of all users for privacy
        </List.Item>
        <List.Item>
          <strong>End-to-End Encryption:</strong> All messages are encrypted with PGP
        </List.Item>
      </List>
    </Alert>
  );
};
