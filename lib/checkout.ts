export async function createPayFastCheckout({
  amount,
  itemName,
  customerEmail,
  customerFirstName,
  customerLastName,
}: {
  amount: number;
  itemName: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
}) {

  // const baseUrl = process.env.NODE_ENV === 'production'
  // ? 'https://khurshidfans.vercel.app'
  // : 'http://localhost:3000';

  const baseUrl = 'https://khurshidfans.vercel.app';

  console.log("log.ts 1");
const res = await fetch(`${baseUrl}/api/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      itemName,
      customerEmail,
      customerFirstName,
      customerLastName,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Checkout failed");
  }

  return data.paymentUrl as string;
}
