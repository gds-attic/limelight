class FeatureToggles
  def initialize
    @feature_toggles = {}
  end

  def update_from_hash(hash)
    feature_toggles_hash =
        hash.reduce({}) do |feature_toggles, (feature, activation)|
          feature_toggles.tap {|ft| ft[feature.to_sym] = toggle_value(activation)}
        end
    @feature_toggles.update(feature_toggles_hash)
  end

  def update_from_yaml_file(file_path)
    update_from_hash(load_yaml(file_path))
  end

  def to_hash
    @feature_toggles
  end

  private

  def toggle_value(activation)
    case activation
      when "release"
        true
      when "dev"
        (Rails.env.development? or Rails.env.test?)
      else
        false
    end
  end

  def load_yaml(file_path)
    YAML.load(File.read(file_path))
  end
end
