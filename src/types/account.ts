const AccountIdBrand = Symbol();
export type AccountId = string & { [AccountIdBrand]: undefined };
export type Account = Readonly<{
  id: AccountId;
  email: string;
}>;
