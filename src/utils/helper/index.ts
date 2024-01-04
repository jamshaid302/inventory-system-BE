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

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const calculateTotal = (sales: any[] | undefined) => {
  return (
    sales?.reduce((acc: any, curr: any) => acc + curr?.invoiceTotal, 0) || 0
  );
};

export const filterSalesByDay = (sales: any[] | undefined, day: Date) => {
  return (
    sales?.filter(
      (item) => item?.date && isSameDay(new Date(item.date), day)
    ) || []
  );
};

export const calculateMonthlySalesTotal = (sales: any[] | undefined) => {
  const eachMonthSalesTotal: Record<number, number> = {};
  sales?.forEach((item) => {
    const month = new Date(item?.date).getMonth();
    eachMonthSalesTotal[month] =
      (eachMonthSalesTotal[month] || 0) + item?.invoiceTotal;
  });

  return Object.values(eachMonthSalesTotal);
};
