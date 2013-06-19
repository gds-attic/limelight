require "spec_helper"

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
