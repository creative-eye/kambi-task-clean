// userType, 0 = normal, 1 = company
// productType, 0 = new product, 1 = old product
// price, the price of the product

/**
 * Price model for user type and product type
 * @returns {{getUser, getProduct}}
 */
// FIXME think of a better solution for this, controller is class, while model
// is function, right now it is not very consistent
function priceModel() {
    return {
        getUser: getUser,
        getProduct: getProduct,
    };

    function getUser() {
        return {
            normal: {
                rebate: 0,
            },
            company: {
                rebate: 5,
            },
        };
    }

    function getProduct() {
        return {
            new: {
                price: 25,
                rebate: 10,
            },
            old: {
                price: 35,
                rebate: 0,
            },
        };
    }
}
/**
 * Holds business logic for calculating prices
 * Will take price model as argument for constructor
 */
class PriceController {
    static getProductRebate(productPriceModel, currentProduct, published) {
        const rebate = productPriceModel[currentProduct].rebate;
        // TODO move 'new' to a constant and make it available for all modules
        // if the product is new and published today, apply data model rebate
        // if not return 0
        if (currentProduct === 'new') {
            if (published.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
                return rebate;
            }
            return 0;
        }
        return rebate;
    }

    static getUserRebate(userPriceModel, currentUserType) {
        return userPriceModel[currentUserType].rebate;
    }

    static getRebate(args) {
        return PriceController.getProductRebate(args.productPriceModel, args.productType, args.published) +
                PriceController.getUserRebate(args.userPriceModel, args.user);
    }

    constructor(priceModel) {
        this.productPriceModel = priceModel.getProduct();
        this.userPriceModel = priceModel.getUser();
    }

    /**
     * Claculates the final price after subtracting the calculated rebate and adding the full price with provided price
     * @param args {object}
     * @param args.productType {string}
     * @param args.user {string} type of the user
     * @param args.price {number} provided base price number
     * @param args.publishedDate {string} standard date format for when the product was published
     * @returns {number}
     */
    calculatePrice(args) {
        const fullPrice = args.price + this.productPriceModel[args.productType].price;
        const rebateData = {
            productPriceModel: this.productPriceModel,
            productType: args.productType,
            published: args.publishedDate,
            userPriceModel: this.userPriceModel,
            user: args.user,
        };
        const rebate = PriceController.getRebate(rebateData);

        return fullPrice - rebate;
    }
}
