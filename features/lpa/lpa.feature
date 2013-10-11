@javascript
Feature: uptime and response time for lpa dashboard
  As a service manager
  I want to know the availability of my service
  So that I can better interpret usage data

  @svg
  Scenario: looking up the uptime
    When I go to /performance/lasting-power-of-attorney
    Then I should see the module "Service availability"
     And the module should display an uptime of 85%
     And the module should display a response time of 563ms

  @svg
  Scenario: conversion funnel
    When I go to /performance/lasting-power-of-attorney
    Then I should see the module "Stages of making an LPA"
     And the module should contain a graph

  Scenario: help usage
    When I go to /performance/lasting-power-of-attorney
    Then I should see the module "Help usage"
      And the module should contain a table

  @svg
  Scenario: checking total completion rate with
    When I go to /performance/lasting-power-of-attorney
    Then the lpa completion rate should display "4% last 4 weeks"
