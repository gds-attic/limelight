Given(/^API responds with (.*)$/) do |fixture_file|
  path = Rails.root.join('spec', 'fixtures', fixture_file)
  
  httparty_stub = double("HttpParty")
  response_stub = double("response")
  
  httparty_stub.stub(:get)
    .and_return(response_stub)
  
  response_stub.stub(:data).and_return(JSON.parse(File.read(path)))
  Songkick::Transport::HttParty.stub(:new)
    .and_return(httparty_stub)
end

Then(/^there should be (\d+) licences$/) do |num_licences|
  page.all("#licences-list li").count.should == num_licences.to_i
end

Then(/^there should be (\d+) authorities$/) do |num_authorities|
  page.all("#authorities-list li").count.should == num_authorities.to_i
end

Given(/^Limelight is running$/) do
  #empty
end

Then(/^the uptime module for licensing should display (.*)$/) do |uptime|
  page.all("#licensing-uptime-module").count.should == 1
  page.find("#licensing-uptime strong").should have_content(uptime)
end

Then(/^the response time module for licensing should display (.*)$/) do |response_time|
  page.all("#licensing-response-time-module").count.should == 1
  page.find("#licensing-response-time strong").should have_content(response_time)
end

Then(/^the uptime module for licence finder should display (.*)$/) do |uptime|
  page.all("#licence-finder-uptime-module").count.should == 1
  page.find("#licence-finder-uptime-module p.impact-number").text.should = uptime
end

Then(/^the response time module for licence finder should display (.*)$/) do |response_time|
  page.all("#licence-finder-response-time-module").count.should == 1
  page.find("#licence-finder-response-time-module p.impact-number").text.should = response_time
end
