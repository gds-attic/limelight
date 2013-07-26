@javascript
Feature: FCO volumetrics graph

  Scenario: checking total completion rate for pay-register-death-abroad
    Given The pay-register-death-abroad journey bucket returns the response in "pay-register-death-abroad-journey.json"
     When I go to /performance/pay-register-death-abroad
     Then the completion rate should display 2%

  Scenario: checking applications completed for pay-register-death-abroad
    Given The pay-register-death-abroad journey bucket returns the response in "pay-register-death-abroad-journey.json"
     When I go to /performance/pay-register-death-abroad
     Then the applications completed should display 2.67