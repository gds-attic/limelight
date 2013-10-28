require_relative "../../features/backdrop_stub/backdrop_stub"
require_relative "../../features/backdrop_stub/stub_config"
require_relative "../../features/backdrop_stub/fixture_loader"

class BackdropStubController < ApplicationController
  @@backdrop_stub = BackdropStub.new(
      FixtureLoader.new('features/backdrop_stub_responses/'),
      [
          StubConfig.new({'service' => 'licensing', 'api_name' => 'realtime'}, 'licensing_realtime.json'),
          StubConfig.new({'service' => 'licensing', 'api_name' => 'monitoring'}, 'licensing_availability_response.json'),
          StubConfig.new({'service' => 'licensing', 'api_name' => 'application', 'filter_by' => 'licenceUrlSlug:application-to-licence-a-street-collection'}, 'application-to-licence-a-street-collection.json'),
          StubConfig.new({'service' => 'licensing', 'api_name' => 'application', 'filter_by' => 'authorityUrlSlug:fake-authority-1', 'group_by' => 'licenceUrlSlug'}, 'licensing_top_5_licenses.json'),
          StubConfig.new({'service' => 'licensing', 'api_name' => 'application', 'filter_by' => 'authorityUrlSlug:fake-authority-1', 'period' => 'week'}, 'licensing_top.json'),
          StubConfig.new({'service' => 'licensing', 'api_name' => 'application', 'filter_by' => 'authorityUrlSlug:fake-authority-1'}, 'fake-authority-1.json'),
          StubConfig.new({'service' => 'licensing', 'api_name' => 'application', 'group_by' => "authorityUrlSlug"}, 'authorities.json'),
          StubConfig.new({'service' => 'licensing', 'api_name' => 'application', 'group_by' => "licenceUrlSlug"}, 'licences.json'),
          StubConfig.new({'service' => 'licensing', 'api_name' => 'applications'}, 'licensing_applications.json'),
          StubConfig.new({'filter_by' => 'dataType:licensing_overview_journey'}, 'licensing_overview_journey.json'),
          StubConfig.new({'service' => 'pay-legalisation-post', 'api_name' => 'journey'}, 'fco_overview_journey.json'),
          StubConfig.new({'service' => 'pay-foreign-marriage-certificates', 'api_name' => 'monitoring', 'period' => 'hour'}, 'foreign_marriage_availability_hour.json'),
          StubConfig.new({'service' => 'pay-foreign-marriage-certificates', 'api_name' => 'monitoring', 'period' => 'day'}, 'foreign_marriage_availability_day.json'),
          StubConfig.new({'service' => 'pay-register-death-abroad', 'api_name' => 'journey'}, 'pay-register-death-abroad-journey.json'),
          StubConfig.new({'service' => 'deposit-foreign-marriage', 'api_name' => 'journey'}, 'journey-with-missing-data.json'),
          StubConfig.new({'service' => 'lasting-power-of-attorney', 'api_name' => 'journey', 'group_by' => 'eventDestination', 'filter_by' => 'eventAction:help.inline'}, 'lpa_help_usage.json'),
          StubConfig.new({'service' => 'lasting-power-of-attorney', 'api_name' => 'journey'}, 'lpa_journey.json'),
          StubConfig.new({'service' => 'lasting-power-of-attorney', 'api_name' => 'monitoring'}, 'lpa_availability.json'),
          StubConfig.new({'service' => 'lasting-power-of-attorney'}, 'lpa_volumes.json'),
          StubConfig.new({'service' => 'vehicle-licensing', 'api_name' => 'failures'}, 'vehicle_licensing_failures.json'),
          StubConfig.new({'service' => 'vehicle-licensing', 'api_name' => 'volumetrics', 'group_by' => 'service'}, 'vehicle_licensing_services.json'),
          StubConfig.new({'service' => 'vehicle-licensing', 'api_name' => 'volumetrics', 'group_by' => 'channel'}, 'vehicle_licensing_volumetrics.json'),
          StubConfig.new({'service' => 'vehicle-licensing', 'api_name' => 'channels'}, 'vehicle_licensing_channels.json'),
          StubConfig.new({'service' => 'vehicle-licensing', 'api_name' => 'customer-satisfaction'}, 'vehicle_licensing_customer_satisfaction.json'),
          StubConfig.new({'service' => 'sorn', 'api_name' => 'monitoring'}, 'availability.json'),
          StubConfig.new({'service' => 'sorn', 'api_name' => 'realtime'}, 'licensing_realtime.json'),
          StubConfig.new({'service' => 'tax-disc', 'api_name' => 'realtime'}, 'licensing_realtime.json'),
          StubConfig.new({'service' => 'tax-disc', 'api_name' => 'monitoring'}, 'availability.json'),
          StubConfig.new({'service' => 'land-registry', 'api_name' => 'search-index-map'}, 'land_registry.json'),
          StubConfig.new({'api_name' => 'monitoring'}, 'licensing_availability_response.json')
      ])

  def serve_fixture
    render :json => @@backdrop_stub.response_for_params(params)
  end

  def self.register(service, bucket, fixture_file)
    @@backdrop_stub.register(StubConfig.new({'service' => service, 'api_name' => bucket}, fixture_file))
  end

  def self.reset
    @@backdrop_stub.clear
  end
end
