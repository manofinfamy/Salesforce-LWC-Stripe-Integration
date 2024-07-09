/**
 * @description       : Test class for StripeAppController
 * @author            : My Dao
 * @last modified on  : 09/07/2024
 * @last modified by  : My Dao
**/
@isTest
private class StripeAppControllerTest {

    @testSetup
    static void setup() {
        // Create test data for Stripe_App_Settings__c
        Stripe_App_Settings__c stripeSettings = new Stripe_App_Settings__c();
        stripeSettings.Name = 'Default';
        stripeSettings.Site_Url__c = 'https://example.com';
        stripeSettings.Cancel_Path__c = '/cancel';
        stripeSettings.Success_Path__c = '/success';
        insert stripeSettings;
    }

    @isTest
    static void testGetPaymentUrl() {
        // Mock the response from the Stripe API
        HttpResponse mockResponse = new HttpResponse();
        mockResponse.setHeader('Content-Type', 'application/json');
        mockResponse.setBody('{"url":"https://stripe.com/checkout"}');
        mockResponse.setStatusCode(200);

        Test.setMock(HttpCalloutMock.class, new StripeHttpMock(mockResponse));

        List<StripeAppController.ProductModel> products = new List<StripeAppController.ProductModel>{
            new StripeAppController.ProductModel('1', 'Product 1', 'Description 1', 10.00, 'https://example.com/image1.png', 1),
            new StripeAppController.ProductModel('2', 'Product 2', 'Description 2', 20.00, 'https://example.com/image2.png', 2)
        };

        String productsJson = JSON.serialize(products);

        // Ensure all previous work is committed before making the callout
        Test.startTest();
        String result = StripeAppController.getPaymentUrl(productsJson);
        Test.stopTest();
        
        System.assertEquals('{"url":"https://stripe.com/checkout"}', result);
    }

    // Mock class for HTTP callouts
    private class StripeHttpMock implements HttpCalloutMock {
        private HttpResponse response;

        public StripeHttpMock(HttpResponse response) {
            this.response = response;
        }

        public HttpResponse respond(HttpRequest req) {
            return response;
        }
    }
}
