class Authority
  attr_accessor :slug, :name
  def initialize(slug, name)
    @slug = slug
    @name = name
  end

  def self.create(authority_data)
    if authority_data["authorityName"].blank?
      name = authority_data["authorityUrlSlug"]
    else
      name = authority_data["authorityName"].first
    end
    self.new(authority_data['authorityUrlSlug'], name)
  end

  def self.from_backdrop_response(backdrop_response)
    unless backdrop_response['data'].count == 1
      raise "expected a response with one entry, got #{backdrop_response}"
    end

    authority = backdrop_response['data'].first
    self.create(authority)
  end
end
