require_relative "../../features/backdrop_stub/backdrop_stub"
require_relative "../../features/backdrop_stub/stub_config"
require_relative "../../features/backdrop_stub/fixture_loader"

class BackdropStubController < ApplicationController
  def serve_fixture
    render :json => backdrop_stub.response_for_params(params)
  end

  def backdrop_stub
    if @backdrop_stub.nil?
      @backdrop_stub = BackdropStub.new(
          FixtureLoader.new('features/backdrop_stub_responses/'),
          [
            StubConfig.new({'filter_by' => 'check:licensing'}, 'licensing_availability_response.json'),
            StubConfig.new({'filter_by' => 'dataType:licensing_overview_journey'}, 'licensing_overview_journey.json'),
            StubConfig.new({'filter_by' => 'check:pay-foreign-marriage-certificates'}, 'pay_foreign_marriage_availability.json')
          ]
      )
    end
    @backdrop_stub
  end
end
