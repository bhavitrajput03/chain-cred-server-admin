import * as bcrypt from 'bcrypt';

export const getPasswordHash = async (password: string) => {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};
