import { load, save } from "~/features/persistence/persistence";
import type { Account, AccountId } from "~/types/account";

function newAccount(id: string) {
  return {
    id: id as AccountId,
    email: "" as string,
  } satisfies Account;
}

export function createAccount(id: string): void {
  const a = newAccount(id);
  const accounts = JSON.parse(load("accounts") ?? "{}");
  accounts[id] = a;
  save("accounts", JSON.stringify(accounts));
}

export function getAccount(id: string): Account | undefined {
  const accounts = JSON.parse(load("accounts") ?? "{}");
  return accounts[id] ?? undefined;
}
