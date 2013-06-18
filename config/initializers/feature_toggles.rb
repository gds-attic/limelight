require_relative '../../lib/feature_toggles'

main_yaml_path = Rails.root.join("config", "feature_toggles.yml")
override_yaml_path  = Rails.root.join("config", "feature_toggles_override.yml")

toggles = FeatureToggles.new
toggles.update_from_yaml_file(main_yaml_path)
toggles.update_from_yaml_file(override_yaml_path) if File.exists? override_yaml_path

Limelight::Application.config.feature_toggles = toggles.to_hash
