/**
 * @description       : Crear Stripe checkout session for cart payment.
 * @author            : My Dao
 * @last modified on  : 09/07/2024
 * @last modified by  : My Dao
**/
public class StripeAppController {
    @AuraEnabled
    public static String getPaymentUrl(String productsJson) {
        try {
            List<ProductModel> products = (List<ProductModel>) JSON.deserialize(productsJson, List<ProductModel>.class);
            System.debug('products:' + products);
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:stripe_credentials/v1/checkout/sessions');
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            req.setHeader('Authorization', 'Bearer {!$Credential.Password}');

            String reqBody = createRequestBody(products);
            req.setBody(reqBody);

            Http http = new Http();
            HttpResponse response = http.send(req);

            return response.getBody();
        } catch (Exception ex) {
            System.debug('Error: ' + ex.getMessage() + ' ' + ex.getStackTraceString());
            return ex.getMessage() + ' ' + ex.getStackTraceString();
        }
    }

    private static String createRequestBody(List<ProductModel> products) {
        Stripe_App_Settings__c stripeSettings = Stripe_App_Settings__c.getInstance();
    
        String siteUrl = stripeSettings.Site_Url__c;
        String successUrl = EncodingUtil.urlEncode(siteUrl + stripeSettings.Success_Path__c, 'UTF-8');
        String cancelUrl = EncodingUtil.urlEncode(siteUrl + stripeSettings.Cancel_Path__c, 'UTF-8');
    
        String body = String.format(
            'success_url={0}&cancel_url={1}&mode=payment',
            new String[] { successUrl, cancelUrl }
        );
    
        for (Integer i = 0; i < products.size(); i++) {
            ProductModel product = products[i];
            String lineItem = String.format(
                '&line_items[{0}][price_data][product_data][name]={1}' +
                '&line_items[{0}][quantity]={2}' +
                '&line_items[{0}][price_data][unit_amount]={3}' +
                '&line_items[{0}][price_data][currency]=usd' +
                '&line_items[{0}][price_data][product_data][description]={4}',
                new String[] {
                    String.valueOf(i),
                    EncodingUtil.urlEncode(product.name, 'UTF-8'),
                    String.valueOf(product.quantity),
                    String.valueOf(Integer.valueOf(product.price * 100)),
                    EncodingUtil.urlEncode(product.description, 'UTF-8')
                }
            );
            body += lineItem;
        }
    
        return body;
    }
    

    public class ProductModel {
        @AuraEnabled
        public String id;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public String description;
        @AuraEnabled
        public Decimal price;
        @AuraEnabled
        public String image;
        @AuraEnabled
        public Integer quantity;

        public ProductModel(String id, String name, String description, Decimal price, String image,Integer quantity) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
            this.image = image;
            this.quantity = quantity;
        }
    }
}