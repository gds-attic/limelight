class Authority
  attr_accessor :slug, :name
  def initialize(slug, name)
    @slug = slug
    @name = name
  end

  def self.from_backdrop_response(slug, backdrop_response)
    authorities = backdrop_response['data']['authorityUrlSlug']
    Authority.new(slug, authorities[slug]['authorityName'][0])
  end
end
