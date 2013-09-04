require 'cucumber/rspec/doubles'
require 'slimmer/test'
require 'capybara/poltergeist'

Capybara.register_driver :poltergeist do |app|
  # TODO: this should really be true and the js layer should deal with any
  # errors before they bubble up
  Capybara::Poltergeist::Driver.new(app, {
    :js_errors => false,
    :debug => false
  })
end

Capybara.javascript_driver = :poltergeist
Capybara.default_wait_time = (ENV['CAPYBARA_WAIT_TIME'] || 5).to_i

puts ""
puts "Capybara wait time: #{Capybara.default_wait_time.inspect}"
puts ""

Before do
  BackdropStubController.reset
end
