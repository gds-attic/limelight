require_relative '../../lib/feature_toggles'
require_relative '../../lib/services'

main_yaml_path = Rails.root.join("config", "feature_toggles.yml")
override_yaml_path  = Rails.root.join("config", "feature_toggles_override.yml")
services_yaml_path = Rails.root.join("config", "services.yml")


toggles = FeatureToggles.new
toggles.update_from_yaml_file(main_yaml_path)
toggles.update_from_yaml_file(override_yaml_path) if File.exists? override_yaml_path

Limelight::Application.config.feature_toggles = toggles.to_hash

services = Services.new(YAML.load(File.read(services_yaml_path)), toggles.to_hash)

Limelight::Application.config.available_services = services.available_services
