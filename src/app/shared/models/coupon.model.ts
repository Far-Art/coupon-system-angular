interface CommonCouponParams {
  id: string,
  companyId: number,
  companyName: string,
  companyEmail: string,
  category: string,
  title: string,
  description: string,
  amount: number,
  price: number,
  image: string,
  isSaleEnded: boolean
}

interface DateCouponParams {
  'startDate': Date,
  'endDate': Date,
}

interface DateAsStringCouponParams {
  'startDate': string,
  'endDate': string,
}

export interface ICouponParams extends CommonCouponParams, DateCouponParams {}

interface ICouponConstructorParams extends CommonCouponParams, DateAsStringCouponParams {}

export class Coupon {

  constructor(public params: ICouponParams) {}

  public static create(params: ICouponParams | ICouponConstructorParams) {
    let coupon: Coupon;
    if (params.startDate as any instanceof Date) {
      coupon = new Coupon(params as ICouponParams);
    } else {
      coupon = new Coupon(this.parseDate(params as ICouponConstructorParams));
    }
    coupon.params.isSaleEnded = coupon.params.endDate.getTime() - new Date().getTime() < 0 || coupon.params.amount === 0;
    return coupon;
  }

  private static parseDate(params: ICouponConstructorParams): ICouponParams {
    const _s = params.startDate.split('-');
    const _e = params.endDate.split('-');
    return {
      ...params,
      startDate: new Date(+_s[0], +_s[1] - 1, +_s[2], 12, 0, 0),
      endDate: new Date(+_e[0], +_e[1] - 1, +_e[2], 12, 0, 0)
    }
  }

}
