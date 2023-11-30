import bcrypt from "bcrypt";

export const hashing = async (password: string) => {
  const saltRounds = 8;
  return await bcrypt.hash(password, saltRounds);
};

export const matchingPass = async (password1: string, password2: string) => {
  return bcrypt.compareSync(password1, password2);
};

export const paginateData = (data: any = [], take = 10, skip = 0) => {
  const start = skip;
  const end = start + take;
  let sortedData = data;

  if (!Array.isArray(data)) {
    console.error("Data is not an array.");
    return [];
  }

  return sortedData.slice(start, end);
};
