require "spec_helper"

# This is a provisional fix for an rails 3.2 issue
# (see https://github.com/rails/rails/pull/9248).
# It allows for a proper test execution with `config.threadsafe!`.
p "Ensuring inclusion of route helpers for 'threadsafe!' tests..."
class ActionView::TestCase::TestController
  include Rails.application.routes.url_helpers
end
p "Done"

describe ApplicationHelper do
  describe "current_main_navigation_path" do
    it "relates licensing to services" do
      [
        'index',
        'licences',
        'per_licence',
        'authorities',
        'per_authority',
      ].each do |action|
        current_main_navigation_path(controller: "licensing", action: action).should == services_path
      end
    end

    it "relates services to services" do
      current_main_navigation_path(controller: "common", action: "services").should == services_path
    end


    it "relates fco to services" do
      [
        'pay_legalisation_post',
        'pay_legalisation_drop_off',
        'pay_register_birth_abroad',
        'pay_register_death_abroad',
        'pay_foreign_marriage_certificates',
        'deposit_foreign_marriage',
      ].each do |action|
        current_main_navigation_path(controller: "fco", action: action).should == services_path
      end
    end

  end
end
