class Authorities
  def self.from_backdrop_response(backdrop_response)
    authorities_to_return = []
    unless backdrop_response.empty?
      if backdrop_response["data"]["authorityUrlSlug"]
        backdrop_response["data"]["authorityUrlSlug"].each do |slug, value|
          authorities_to_return.append(Authority.new(slug, value["authorityName"][0]))
        end
      end
    end
    authorities_to_return
  end
end
