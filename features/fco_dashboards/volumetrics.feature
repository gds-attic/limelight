@javascript
Feature: FCO volumetrics graph

  @svg
  Scenario: checking total completion rate for pay-register-death-abroad
     When I go to /performance/pay-register-death-abroad
     Then the completion rate should display "2% last 3 weeks"

  @svg
  Scenario: checking applications completed for pay-register-death-abroad
     When I go to /performance/pay-register-death-abroad
     Then the applications completed should display "2.67 mean per week over the last 3 weeks"

  @svg
  Scenario: checking total completion rate with missing data
    When I go to /performance/deposit-foreign-marriage
    Then the completion rate should display "7% last 9 weeks (1 week unavailable)"

  @svg
  Scenario: checking applications completed with missing data
    When I go to /performance/deposit-foreign-marriage
    Then the applications completed should display "20.4 mean per week over the last 9 weeks (1 week unavailable)"
