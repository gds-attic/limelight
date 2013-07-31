class Service
  attr_reader :name, :slug, :excluded_from_list, :toggle

  def initialize(service_config)
    @name = service_config["name"]
    @slug = service_config["slug"]
    @excluded_from_list = service_config["excluded_from_list"] || false
    @toggle = service_config["feature_toggle"]
  end
end

class Services

  def initialize(config, feature_toggles)
    @services = config["dashboards"].map {|properties| Service.new(properties)}
    @feature_toggles = feature_toggles.to_hash
  end

  def available_services
    @services.select do |service|
      service.toggle.nil? ? true : @feature_toggles[service.toggle.to_sym]
    end.index_by(&:slug)
  end
end
