require_relative "../../features/backdrop_stub/backdrop_stub"
require_relative "../../features/backdrop_stub/stub_config"
require_relative "../../features/backdrop_stub/fixture_loader"

class BackdropStubController < ApplicationController
  def serve_fixture
    render :json => backdrop_stub.response_for_params(params)
  end

  def backdrop_stub
    unless @backdrop_stub
      @backdrop_stub = BackdropStub.new(
          FixtureLoader.new('features/backdrop_stub_responses/'),
          [StubConfig.new({'filter_by' => 'foo:bar'}, 'fixture_for_spec.json')]
      )
    end
    @backdrop_stub
  end
end
