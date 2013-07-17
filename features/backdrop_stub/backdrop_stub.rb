class BackdropStub
  def initialize(fixture_loader, list_of_configs)
    @fixture_loader = fixture_loader
    @stub_configs = list_of_configs
  end

  def response_for_params(params)
    config = @stub_configs.find { |config|
      config.matches_parameters?(params)
    }

    @fixture_loader.load(config.response) unless config.nil?
  end

  def register(config)
    @stub_configs.reject! { |c| c.matches_parameters?(config.query) }
    @stub_configs << config
  end

  def clear
    @stub_configs.clear
  end
end
