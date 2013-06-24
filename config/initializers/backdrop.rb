backdrop_location = 'http://publicapi.dev.gov.uk'
if Rails.env.test?
  backdrop_location = '/backdrop_stub'
end
Limelight::Application.config.backdrop_url = ENV["BACKDROP_URL"] || backdrop_location
