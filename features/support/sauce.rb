if ENV["CUCUMBER_PROFILE"] == 'sauce'
  require 'sauce'
  require 'sauce/utilities'
  require 'sauce/cucumber'
  require 'sauce/capybara'
  require 'sauce/parallel'

  Capybara.default_driver = :sauce

  if ENV["APP_HOST"]
    # Use provided application location
    Capybara.app_host = ENV["APP_HOST"]
  else
    # Use Capybara server. To work with sauce, Capybara has to run with a
    # recognised port. List of ports recognised by Sauce can be found at
    # https://saucelabs.com/ruby
    Capybara.server_port = 49221
  end

  # We are using Open Sauce accounts which require all tests to be public.
  # The sauce/cucumber gem does not allow configuring jobs as public.
  # As a workaround, reopen Sauce::Job initialize method and force job
  # to be public.
  Sauce::Job.class_eval do
    def initialize(options)
      options["public"] = true
      build!(options)
      @client = Sauce::Client.new
    end
  end

  Sauce.config do |c|
    if ENV['USE_TUNNEL']
      c[:start_tunnel] = true
      start_tunnel_for_parallel_tests(c)
    else
      c[:start_tunnel] = false
    end

    if ENV['TRAVIS_JOB_NUMBER']
      c[:tunnel_identifier] = ENV['TRAVIS_JOB_NUMBER']
    end

    platform, name, version = ENV["BROWSER"].split(',')
    
    c[:browsers] = [[platform, name, version]]
  end

  Before do
    Sauce::Capybara::Cucumber.before_hook
  end

  Around do |scenario, block|
    Sauce::Capybara::Cucumber.around_hook scenario, block
  end

  at_exit do
    Sauce::Utilities::Connect.close
  end

end

