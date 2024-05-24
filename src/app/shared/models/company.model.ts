interface ICompanyParams {
  id: number,
  name: string,
  email: string,
  clientType: string,
  imageUrl?: string
}

export class Company {

  constructor(public params: ICompanyParams
  ) {}

  public static create(params: ICompanyParams) {
    return new Company(params);
  }

}
