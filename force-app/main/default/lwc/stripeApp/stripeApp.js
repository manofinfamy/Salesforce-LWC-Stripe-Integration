import { LightningElement, track } from 'lwc';

export default class StripeApp extends LightningElement {
    @track showProductList = true;
    @track selectedProducts = [];
    @track initialCardItems = [];
    @track cartCount = 0; 

     /**
     * Handle view cart event. Get the dispatched selectedProducts from child component (StripeProductList)
     * and hide product list.
     */
    handleViewCart(event) {
        this.selectedProducts = event.detail.selectedProducts;
        this.showProductList = false;
    }

     /**
     * Handle contunue shopping event. Get the dispatched selectedProducts from child component (StripeCart)
     * and show product list again.
     */
    handleContinueShopping(event) {
        this.showProductList = true;
        this.selectedProducts = event.detail.selectedProducts;
    }
}