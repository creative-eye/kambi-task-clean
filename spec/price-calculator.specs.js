let userPriceModel;
let productPriceModel;
let priceController;
describe('price calculator controller', () => {
    before(() => {
        // FIXME find a better solution for this
        userPriceModel = {
            normal: {
                rebate: 0,
            },
            company: {
                rebate: 5,
            },
        };
        productPriceModel = {
            new: {
                price: 25,
                rebate: 10,
            },
            old: {
                price: 35,
                rebate: 0,
            },
        };
        priceController = new PriceController(priceModel());
    });

	it('should add an additional price for product type', () => {
        const priceData = {
            // set user as normal to not add rebate
            user: 'normal',
            productType: 'old',
            price: 100,
            // set date in the past to not trigger published today business logic
            publishedDate: new Date('10/10/2010'),
        };
        const expected = 100 + productPriceModel['old'].price;
        const actual = priceController.calculatePrice(priceData);
        expect(expected).to.equal(actual);
    });

	it('should add a specific rebate if product is new and published today and user is of company type', () => {
	    const priceData = {
            // set user as normal to not add rebate
            user: 'normal',
            productType: 'new',
            price: 100,
            // set date in the past to not trigger published today business logic
            publishedDate: new Date(),
        };
	    const expected = 100 + productPriceModel['new'].price -
            (productPriceModel['new'].rebate + userPriceModel['normal'].rebate);
        const actual = priceController.calculatePrice(priceData);
        expect(expected).to.equal(actual);
	});

    it('should add a specific rebate if user is of company type', () => {
        const priceData = {
            // set user as normal to not add rebate
            user: 'normal',
            productType: 'old',
            price: 100,
            // set date in the past to not trigger published today business logic
            publishedDate: new Date(),
        };
        const expected = 100 + productPriceModel['old'].price -
            (productPriceModel['old'].rebate + userPriceModel['normal'].rebate);
        const actual = priceController.calculatePrice(priceData);
        expect(expected).to.equal(actual);
    });

});

describe('price model', () => {
    // TODO add tests for data structure based on the constants for
    // user type and product type
});
