# Stripe Integration Demo App

The Stripe Integration Demo App is a demonstration of how Salesforce's Lightning Web Component (LWC) framework can be leveraged to create a user-friendly, efficient, and modular application that supports e-commerce processes by integrating with Stripe for payments.

The App focuses on the user interface and front-end logic, allowing users to select products, view their cart, and proceed to checkout using Stripe without storing any submitted data.

## App Overview

![App Overview](/images/app-overview.png)

### App structure

The App consists of several LWCs organized within a Lightning App Page to create a seamless e-commerce experience:

-   **stripeApp**: Serves as a container for the entire shopping and checkout process within the Salesforce UI.
-   **stripeProductList**: Displays a list of products available for purchase and allows users to add products to their cart.
-   **stripeCart**: Shows selected products and the total cost, and provides options to proceed to checkout with Stripe or continue shopping.

### Getting Started

#### Code Checkout and Org Authorization

1. Clone the repository to your local machine.
    ```sh
    git clone <repository-url>
    ```
2. Use Salesforce CLI to authorize your Salesforce org where you intend to deploy the app.
    ```sh
    sfdx auth:web:login --alias <org-alias> --instance-url <org-url> --set-default
    ```

#### Deploy Application Components

1. Navigate to the root directory of the project in your terminal.
2. Deploy the components to your Salesforce org.
    ```sh
    sf project deploy start -x manifest/package.xml
    ```

#### Update Named Credentials

Update the password of `stripe_credentials`

#### Create Custom Setting

Create an Org Level setting of `Stripe_App_Settings`
