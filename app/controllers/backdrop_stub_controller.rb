require_relative "../../features/backdrop_stub/backdrop_stub"
require_relative "../../features/backdrop_stub/stub_config"
require_relative "../../features/backdrop_stub/fixture_loader"

class BackdropStubController < ApplicationController
  @@backdrop_stub = BackdropStub.new(
      FixtureLoader.new('features/backdrop_stub_responses/'),
      [
          StubConfig.new({'service' => 'licensing', 'api_name' => 'monitoring'}, 'licensing_availability_response.json'),
          StubConfig.new({'filter_by' => 'dataType:licensing_overview_journey'}, 'licensing_overview_journey.json'),
          StubConfig.new({'service' => 'pay-legalisation-post', 'api_name' => 'journey'}, 'fco_overview_journey.json'),
          StubConfig.new({'service' => 'pay-foreign-marriage', 'api_name' => 'monitoring'}, 'pay_foreign_marriage_availability.json'),
          StubConfig.new({'service' => 'pay-register-death-abroad', 'api_name' => 'journey'}, 'pay-register-death-abroad-journey.json'),
          StubConfig.new({'service' => 'lasting-power-of-attorney', 'api_name' => 'journey'}, 'lpa_journey.json'),
          StubConfig.new({'service' => 'lasting-power-of-attorney'}, 'lpa_volumes.json')
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
