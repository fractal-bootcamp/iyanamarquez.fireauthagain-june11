export type User = {
  id: number;
  firebaseId: string;
  name: string;
  authenticationToken?: string | null;
};
