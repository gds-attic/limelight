class Authority
  include Comparable

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

  def short_name
    regexp = /(^((London |Royal )?Borough (Council )?of |City (and County )?of (?!London))|( City| County|( County| Metropolitan)? Borough|( City( and| Metropolitan))? District)? Council$)/;
    @name.gsub(regexp, "")
  end

  def <=>(another_authority)
    short_name <=> another_authority.short_name
  end
end
