Feature: Services page
  As a user
  I want to visit the services page
  So I can see a list of available services and navigate to them


  Scenario: visiting services page
       When I go to /performance/services
       Then I should get back a status of 200
        And the page title should be "Services"
        And the page subtitle should be "Services integrated with the Performance Platform"
        And the "services" count should be 10
        And the "service-groups" count should be 1

  Scenario Outline: navigating to service
    When I go to /performance/services
     And I click on "<Title>"
    Then I should get back a status of 200
     And I should be at <Path>
     And the page title should be "<Title>"
    
    Examples:
      | Title                                                      | Path                                           |
      | Deposit foreign marriage or civil partnership certificates | /performance/deposit-foreign-marriage          |
      | Tax disc                                                   | /performance/tax-disc                          |
      | SORN                                                       | /performance/sorn                              |
      | Lasting Power of Attorney                                  | /performance/lasting-power-of-attorney         |
      | Licensing                                                  | /performance/licensing                         |  
      | Pay to get documents legalised by post                     | /performance/pay-legalisation-post             |  
      | Pay to legalise documents using the premium service        | /performance/pay-legalisation-drop-off         |  
      | Payment to register a birth abroad in the UK               | /performance/pay-register-birth-abroad         |  
      | Payment to register a death abroad                         | /performance/pay-register-death-abroad         |  
      | Payment for certificates to get married abroad             | /performance/pay-foreign-marriage-certificates |

  Scenario Outline: navigating to service group
    When I go to /performance/services
     And I click on "<Title>"
    Then I should get back a status of 200
     And I should be at <Path>
     And the page title should be "<Title>"

    Examples:
      | Title                                                      | Path                                           |
      | Vehicle licensing                                          | /performance/vehicle-licensing                 |
