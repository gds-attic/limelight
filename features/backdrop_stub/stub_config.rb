class StubConfig
  attr_accessor :query, :response

  def initialize(query, response)
    @query = query
    @response = response
  end

  def matches_parameters?(parameters)
    query.to_a - parameters.to_a == []
  end
end
