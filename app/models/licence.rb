class Licence
  attr_accessor :name, :slug

  def initialize(slug, name)
    @name = name
    @slug = slug
  end

  def self.from_backdrop_response(backdrop_response)
    if backdrop_response["data"].count != 1
      raise "expected exactly one entry, got #{backdrop_response}"
    end
    licences = backdrop_response["data"][0]
    self.new(licences["licenceUrlSlug"], licences["licenceName"][0])
  end
end
