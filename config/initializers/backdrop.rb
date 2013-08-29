backdrop_location = Rails.env.test? ? '/backdrop_stub' : '/'
Limelight::Application.config.backdrop_url = ENV["BACKDROP_URL"] || backdrop_location
