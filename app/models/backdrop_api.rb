require "songkick/transport"

Songkick::Transport.logger = Rails.logger
Transport = Songkick::Transport::HttParty

class BackdropAPI
  
  def initialize(backdrop_url, credentials=nil)
    @backdrop_url = backdrop_url
    @credentials = credentials
  end
  
  def get_licences
    response = get("#{path("licensing", "application")}?group_by=licenceUrlSlug&collect=licenceName&sort_by=licenceName:ascending")
    response.data
  end

  def get_authorities
    response = get("#{path("licensing", "application")}?group_by=authorityUrlSlug&collect=authorityName&sort_by=authorityName:ascending")
    response.data
  end

  def get_licence(slug)
    response = get("#{path("licensing", "application")}?filter_by=licenceUrlSlug:#{slug}&group_by=licenceUrlSlug&collect=licenceName")
    response.data
  end

  def get_authority(slug)
    response = get(
      "#{path("licensing", "application")}?filter_by=authorityUrlSlug:#{slug}" +
      "&group_by=authorityUrlSlug&collect=authorityName"
    )
    response.data
  end

  def get(path)
    transport = Songkick::Transport::HttParty.new(@backdrop_url, :user_agent => "Limelight", :timeout => 30)

    if @credentials.present?
      encoded_credentials = Base64.strict_encode64 "#{@credentials[:username]}:#{@credentials[:password]}"
      transport = transport.with_headers("Authorization" => "Basic #{encoded_credentials}")
    end

    transport.get(path)
  end

  def path(service, bucket)
    "/performance/#{service}/api/#{bucket}"
  end

end
