class Licences
  def self.from_backdrop_response(backdrop_response)
    backdrop_response['data'].map { |licence_data|
      Licence.create(licence_data)
    }
  end
end
