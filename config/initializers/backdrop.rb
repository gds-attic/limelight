backdrop_url = (Rails.env.test? || ENV["USE_STUB_API"]) ? '/backdrop_stub' : '/'
backdrop_port = (Rails.env.test? || ENV["USE_STUB_API"]) ? '49221' : ''

Limelight::Application.config.backdrop_url = ENV["BACKDROP_URL"] || backdrop_url
Limelight::Application.config.backdrop_port = ENV["BACKDROP_PORT"] || backdrop_port
