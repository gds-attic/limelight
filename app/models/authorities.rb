class Authorities
  def self.from_backdrop_response(backdrop_response)
    backdrop_response["data"].map {|authority_data|
      Authority.create(authority_data)
    }
  end
end
