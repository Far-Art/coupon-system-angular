interface ICouponParams {
  id: number,
  companyId: number,
  category: string,
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  amount: number,
  price: number,
  imageUrl: string,
  companyName: string
}

export class Coupon {

  constructor(public params: ICouponParams
  ) {}

  public static create(params: ICouponParams) {
    return new Coupon(params);
  }

}
