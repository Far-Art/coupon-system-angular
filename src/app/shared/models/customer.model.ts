interface ICustomerParams {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  clientType: string,
  imageUrl?: string
}

export class Customer {

  constructor(public params: ICustomerParams
  ) {}

  public static create(params: ICustomerParams) {
    return new Customer(params);
  }

}
