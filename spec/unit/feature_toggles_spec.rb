require_relative '../../lib/feature_toggles'

describe "Feature toggles" do
  describe "update from hash" do

    it "should load feature toggles from a hash" do
      hash = {
          show_first_item: 'release',
          show_second_item: 'off',
      }

      feature_toggles = FeatureToggles.new
      feature_toggles.update_from_hash(hash)
      toggles_hash = feature_toggles.to_hash

      toggles_hash.should include({show_first_item: true})
      toggles_hash.should include({show_second_item: false})
    end

    it "should append new toggles to existing ones" do
      hash = {
          show_first_item: 'release',
          show_second_item: 'off',
      }
      another_hash = {
          show_third_item: 'release'
      }

      feature_toggles = FeatureToggles.new
      feature_toggles.update_from_hash(hash)
      feature_toggles.update_from_hash(another_hash)
      toggles_hash = feature_toggles.to_hash

      toggles_hash.should include({show_first_item: true})
      toggles_hash.should include({show_third_item: true})
    end

    it "should override existing toggles" do
      hash = {
          show_first_item: 'release',
          show_second_item: 'off',
      }
      another_hash = {
          show_second_item: 'release'
      }

      feature_toggles = FeatureToggles.new
      feature_toggles.update_from_hash(hash)
      feature_toggles.update_from_hash(another_hash)
      toggles_hash = feature_toggles.to_hash

      toggles_hash.should include({show_first_item: true})
      toggles_hash.should include({show_second_item: true})
    end
  end

  describe "update from yaml file" do
    it "should load feature toggles from a yaml file path" do
      feature_toggles = FeatureToggles.new
      feature_toggles.update_from_yaml_file(
          Rails.root.join("spec", "unit", "feature_toggles_test.yml"))

      toggles_hash = feature_toggles.to_hash
      toggles_hash.should include({show_when_release: true})
      toggles_hash.should include({show_when_dev: true})
      toggles_hash.should include({show_never: false})
    end
  end
end