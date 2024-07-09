import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ToastContainer from "lightning/toastContainer";
import getPaymentUrl from "@salesforce/apex/StripeAppController.getPaymentUrl";

export default class StripeCart extends LightningElement {
    isLoading = false;
    @api initialItems;
    @track selectedProducts;

    /**
     * Calculate total cost of all selected products.
     */
    get totalCost() {
        return this.selectedProducts.reduce((total, item) => total + item.quantity * item.price, 0);
    }

    /**
     * Define a cart is empty or not.
     */
    get isCardEmpty() {
        if (!this.selectedProducts || this.selectedProducts.length === 0) return true;
        return false;
    }

    /**
     * Lifecycle hook that runs when the component is inserted into the DOM.
     * Receive initial items sent from Parent component( stripeApp)
     */
    connectedCallback() {
        this.selectedProducts = this.initialItems;
        const toastContainer = ToastContainer.instance();
        toastContainer.toastPosition = "top-right";
    }

    /**
     * Handle quantity change event.
     */
    updateQuantity(event) {
        // Get the product ID from the dataset of the target element
        const productId = event.target.dataset.id;
        // Get the new quantity from the value of the target element and convert it to an integer
        const newQuantity = parseInt(event.target.value, 10);

        let itemIndex = this.selectedProducts.findIndex((i) => i.id === productId);
        // If the item is found
        if (itemIndex !== -1) {
            // Create a shallow copy of the selectedProducts array
            let newCartItems = [...this.selectedProducts];
            // Create a new object for the item with the updated quantity and replace it in the new array
            newCartItems[itemIndex] = {
                ...newCartItems[itemIndex],
                quantity: newQuantity
            };
            // Reassign the selectedProducts property to the new array to trigger reactivity
            this.selectedProducts = newCartItems;
        }
    }

    /**
     * Handle item removal event.
     */
    removeItem(event) {
        const productId = event.currentTarget.dataset.id;
        this.selectedProducts = this.selectedProducts.filter((item) => item.id !== productId);
    }

    /**
     * Handle checkout event. Call API to Stripe checkout session for payment.
     */
    checkout() {
        let invalidQuantity = this.selectedProducts.filter((item) => item.quantity < 0).length > 0;
        if (invalidQuantity) {
            this.showError("Please enter a valid quantity as a positive number");
            return;
        }
        this.isLoading = true;
        getPaymentUrl({ productsJson: JSON.stringify(this.selectedProducts) })
            .then((result) => {
                let jsonResult = JSON.parse(result);
                if (jsonResult.url) {
                    window.open(jsonResult.url, "_self");
                }
            })
            .catch((error) => {
                // Handle error
                console.error("Error retrieving payment URL:", error);
            });
    }

    /**
     * Handle continue shopping event.Dispatched updated selectedProducts to Parent component (stripeApp)
     */
    continueShopping() {
        this.dispatchEvent(
            new CustomEvent("continueshopping", {
                detail: {
                    selectedProducts: this.selectedProducts
                }
            })
        );
    }

    showError(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Error",
                message: error,
                variant: "error"
            })
        );
    }
}
