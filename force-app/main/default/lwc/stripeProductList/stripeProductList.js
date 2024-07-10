import { LightningElement, track, api } from "lwc";
import STRIPE_APP from "@salesforce/resourceUrl/stripeApp";

export default class StripeProductList extends LightningElement {
    @api selectedProducts; // Initial selected products
    @track cartItems = []; 
    @track products = [
        {
            id: "p1",
            name: "Smartphone",
            price: 299,
            description: "High-end smartphone with 128GB storage",
            image: STRIPE_APP + "/smartphone.webp", 
            selected: false,
            inventory: 15,
            isLowStock: false,
            quantity:0
        },
        {
            id: "p2",
            name: "Headphones",
            price: 199,
            description: "Noise-cancelling headphones",
            image: STRIPE_APP + "/headphone.webp", 
            selected: false,
            inventory: 4,
            isLowStock: true,
            quantity:0
        },
        {
            id: "p3",
            name: "Smartwatch",
            price: 399,
            description: "Latest model smartwatch with heart monitor",
            image: STRIPE_APP + "/smartwatch.webp", 
            selected: false,
            inventory: 6,
            isLowStock: false,
            quantity:0
        },
        {
            id: "p4",
            name: "Laptop",
            price: 1999,
            description: "Latest model laptop",
            image: STRIPE_APP + "/laptop.webp", 
            selected: false,
            inventory: 6,
            isLowStock: false,
            quantity:0
        },
        {
            id: "p5",
            name: "Tablet",
            price: 1999,
            description: "Sleek and powerful tablet with a 10-inch display",
            image: STRIPE_APP + "/tablet.webp", 
            selected: false,
            inventory: 6,
            isLowStock: false,
            quantity:0
        },
        {
            id: "p6",
            name: "Earbuds",
            price: 1999,
            description: "Noise-cancelling earbuds",
            image: STRIPE_APP + "/earbuds.webp", 
            selected: false,
            inventory: 6,
            isLowStock: false,
            quantity:0
        }
    ];
    /**
     * Lifecycle hook that runs when the component is inserted into the DOM.
     * Check if any product is previously selected (and now continue shopping), update the previously
     * selected quatity and marked the product as "selected". 
     */
    connectedCallback() {
        for(const product of this.products){
            const selectedProduct = this.selectedProducts?.find(item => item.id === product.id);
            if(selectedProduct){
                product.quantity = selectedProduct.quantity;
                product.selected = true;
            }
        }
    }

    /**
     * Handle add to cart event when a product is selected, mark it as "selected" and the quantity is 1.
     */
    addToCart(event) {
        const productId = event.target.dataset.id;
        let product = this.products.find((prod) => prod.id === productId);
        if (product) {
            product.selected = true;
            product.quantity = 1;
        }
    }

    /**
     * Count all selected items in the cart.
     */
    get cartCount() {
        return this.products.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Handle view cart event. Dispatch all selected products to Parent Component.
     */
    viewCart() {
        const selectedProducts = this.products.filter(product => product.quantity > 0);
        // Dispatch product list and cart count to the parent component
        this.dispatchEvent(new CustomEvent('viewcart', {
            detail: {
                selectedProducts: selectedProducts
            }
        }));   
    }  
}