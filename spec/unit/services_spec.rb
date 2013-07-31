require 'spec_helper'

describe Services do

  let(:services_config) {
    {"dashboards" => [
        {
            "slug" => "available_service",
            "name" => "Service Name"
        },
        {
            "slug" => "toggled_on_service",
            "name" => "Toggled On Service",
            "feature_toggle" => "service_toggle"
        },
        {
            "slug" => "toggled_off_service",
            "name" => "Another Service Name",
            "feature_toggle" => "another_service_toggle"
        },
        {
            "slug" => "excluded_from_list_service",
            "name" => "Excluded From List Service",
            "excluded_from_list" => true
        },
        {
            "slug" => "not_excluded_from_list_service",
            "name" => "Not Excluded From List Service",
            "excluded_from_list" => false
        }
    ]}
  }
  let(:feature_toggles) {
    feature_toggles = FeatureToggles.new
    feature_toggles.update_from_hash({
      "service_toggle" => "dev",
      "another_service_toggle" => "off"
    })
    feature_toggles
  }
  let(:services) { Services.new(services_config, feature_toggles) }

  it 'should assume services without feature toggles are are available' do
    services.available_services.keys.should include "available_service"
  end

  it 'should have services toggled on available' do
    services.available_services.keys.should include "toggled_on_service"
  end

  it 'should not have services toggled off available' do
    services.available_services.keys.should_not include "toggled_off_service"
  end

  it 'should have available services with slug and name' do
    services.available_services["available_service"].name.should == "Service Name"
    services.available_services["available_service"].slug.should == "available_service"
  end

  it 'should assume excluded_from_list is false by default' do
    services.available_services["available_service"].excluded_from_list.should be_false
  end

  it 'should set excluded_from_list when provided' do
    services.available_services["excluded_from_list_service"].excluded_from_list.should be_true
    services.available_services["not_excluded_from_list_service"].excluded_from_list.should be_false
  end

end
