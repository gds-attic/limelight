Feature: Visiting per-authority
  As a user
  I want to see details about specific authorities
  So I can find out how a specific authority is performing

  @svg @javascript
  Scenario: visiting per-authority page on an SVG browser
    When I go to /performance/licensing/authorities/fake-authority-1
    Then I should get back a status of 200
    And the navigation link for "Authorities" should be active
    And the page title should be "Fake authority 1"
    And the 1st subtitle should be "Forms received"
    And the 1st section description should be "Total forms received per week over the last 9 weeks and top licences by volume in this time"
    And the 2nd subtitle should be "Licence submissions received"
    And the 2nd section description should be "Licences offered by Fake authority 1 on GOV.UK"

  @no-svg @javascript
  Scenario: visiting per-authority page on a non-SVG browser
    When I go to /performance/licensing/authorities/fake-authority-1
    Then I should get back a status of 200
    And the navigation link for "Authorities" should be active
    And the page title should be "Fake authority 1"
    And the 1st subtitle should be "Licence submissions"
    And the 1st section description should be "Licences offered by Fake authority 1 on GOV.UK"
