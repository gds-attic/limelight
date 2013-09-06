module Jasmine
  def self.runner_template
    template = ENV['RUN_JASMINE_WITH_CODE_COVERAGE'] == "true" ? "run_blanket.html.erb" : "run.html.erb"
    File.read(File.join(File.dirname(__FILE__), template))
  end
end

Jasmine.configure do |config|
  config.add_rack_path('/limelight', lambda {
    # In order to have asset helpers like asset_path and image_path, we need to require 'action_view/base'.  This
    # triggers run_load_hooks on action_view which, in turn, causes sprockets/railtie to load the Sprockets asset
    # helpers.  Alternatively, you can include the helpers yourself without loading action_view/base:
    Rails.application.assets.context_class.instance_eval do
      include ::Sprockets::Helpers::IsolatedHelper
      include ::Sprockets::Helpers::RailsHelper
    end
    Rails.application.assets
  })
end

