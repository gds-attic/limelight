class Authority
  attr_accessor :slug, :name
  def initialize(slug, name)
    @slug = slug
    @name = name
  end

  def self.from_backdrop_response(backdrop_response)
    unless backdrop_response['data'].count == 1
      raise "expected a response with one entry, got #{backdrop_response}"
    end

    authority = backdrop_response['data'][0]
    Authority.new(authority['authorityUrlSlug'], authority['authorityUrlSlug'])
  end
end
