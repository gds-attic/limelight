source 'https://rubygems.org'
source "https://BnrJb6FZyzspBboNJzYZ@gem.fury.io/govuk/"

gem "rails", "3.2.14"
gem "unicorn", "4.6.3"

gem "slimmer", "3.19.0"
gem "songkick-transport", "1.0.1", :git => "git://github.com/songkick/transport.git"
gem "httparty", "0.11.0"
gem "multi_xml", "0.5.5"
gem "plek", "1.4.0"
gem "govuk_frontend_toolkit", "0.35.0"


# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '3.2.5'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platforms => :ruby

  gem "uglifier", "2.2.1"
end

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'debugger'

group :test, :development do
  gem "rspec-rails", "2.14.0"
  
  gem "brakeman", "2.1.1"

  gem "cucumber-rails", "1.4.0", :require => false
  gem "poltergeist", "1.4.0"
  gem "jasmine", "1.3.2"
  gem "jasmine-phantom", "0.0.9"

  gem 'fakeweb', "1.3.0"
  gem 'pry-rails', "~> 0.3.2"
end
