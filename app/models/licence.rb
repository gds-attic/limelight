class Licence
  attr_accessor :name, :slug

  def initialize(slug, name)
    @name = name
    @slug = slug
  end
  
  def self.create(licence_data)
    if licence_data["licenceName"].blank?
      name = licence_data["licenceUrlSlug"]
    else
      name = licence_data["licenceName"].first
    end
    self.new(licence_data["licenceUrlSlug"], name)
  end

  def self.from_backdrop_response(backdrop_response)
    if backdrop_response["data"].count != 1
      raise "expected exactly one entry, got #{backdrop_response}"
    end
    licence = backdrop_response["data"].first
    self.create(licence)
  end
end
