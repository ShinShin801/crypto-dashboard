'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { PolyscanTransactionData } from './definitions';
import { fetchUserId } from './data';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const FormAddressSchema = z.object({
  address: z.string().refine((address) => /^0x[a-fA-F0-9]{40}$/.test(address), {
    message:
      'Please enter valid wallet address(0x followed by 40 hexadecimal characters).',
  }),
});

const FormUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long.' })
    .max(10, { message: 'Name must be no longer than 10 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(5, { message: 'Password must be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, {
      message: 'Password must contain at least one letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type StateAddress = {
  errors?: {
    user_id?: string[];
    address?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
  // Test it out:
  // console.log(rawFormData);
  // console.log(typeof rawFormData.amount);
}

export async function insertPolyscanTransactions(
  transactions: PolyscanTransactionData[],
) {
  for (const transaction of transactions) {
    try {
      await sql`
        INSERT INTO polygonscan_transactions (
          user_id,
          txhash,
          blockno,
          unixtimestamp,
          dateTime_utc,
          from_address,
          to_address,
          value_in_matic,
          value_out_matic,
          contract_address,
          current_value,
          txnfee_matic,
          txnfee_usd,
          historical_price_matic,
          status,
          errcode,
          method
        ) VALUES (
          ${transaction.user_id},
          ${transaction.txhash},
          ${transaction.blockno},
          ${transaction.unixtimestamp},
          ${transaction.dateTime_utc},
          ${transaction.from_address},
          ${transaction.to_address},
          ${transaction.value_in_matic},
          ${transaction.value_out_matic},
          ${transaction.contract_address},
          ${transaction.current_value},
          ${transaction.txnfee_matic},
          ${transaction.txnfee_usd},
          ${transaction.historical_price_matic},
          ${transaction.status},
          ${transaction.errcode},
          ${transaction.method}
        )
      `;
    } catch (error) {
      // console.error(
      //   'Database Error: Failed to insert transaction data.',
      //   error,
      // );
      console.log(error);
      throw new Error();
    }
  }
}

export async function insertAddress(
  prevState: StateAddress,
  formData: FormData,
) {
  const validatedFields = FormAddressSchema.safeParse({
    address: formData.get('address'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add the address.',
    };
  }

  // Prepare data for insertion into the database
  const user_id = await fetchUserId();
  const { address } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
    INSERT INTO useraddress (user_id, address)
    VALUES (${`${user_id}`}, ${address})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Insert address.',
    };
  }

  revalidatePath('/dashboard/wallets');
  redirect('/dashboard/wallets');
  // Test it out:
  // console.log(rawFormData);
  // console.log(typeof rawFormData.amount);
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoices');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
}

const bcrypt = require('bcrypt');
export async function createUsers(
  prevState: string | undefined,
  formData: FormData,
) {
  console.log('Here');
  const validatedFields = FormUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  console.log(formData.get('name'));
  console.log(formData.get('email'));
  console.log(formData.get('password'));

  if (!validatedFields.success) {
    return `
    Name: ${validatedFields.error.flatten().fieldErrors.name}
    Email: ${validatedFields.error.flatten().fieldErrors.email}
    Pass: ${validatedFields.error.flatten().fieldErrors.password}`;
    // {
    //   errors: validatedFields.error.flatten().fieldErrors,
    //   message: 'Missing Fields. Failed to Add the address.',
    // };
  }

  // Prepare data for insertion into the database
  const { name, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await sql`
    INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
    `;
  } catch (error) {
    return `Error: ${error}`;
  }

  redirect('/login');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
