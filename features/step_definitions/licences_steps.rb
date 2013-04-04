Given(/^API responds with (.*)$/) do |fixture_file|
  path = Rails.root.join('features', 'fixtures', fixture_file)
  
  httparty_stub = double("HttpParty")
  response_stub = double("response")
  
  httparty_stub.stub(:get)
    .and_return(response_stub)
  
  response_stub.stub(:data).and_return(JSON.parse(File.read(path)))
  Songkick::Transport::HttParty.stub(:new)
    .and_return(httparty_stub)
end

When(/^I go to (.*)$/) do |url|
  visit url
end

Then(/^I should get back a status of (\d+)$/) do |status_code|
  page.status_code.should == status_code.to_i
end

Then(/^there should be (\d+) licences$/) do |num_licences|
  page.all("ul#licences li").count.should == num_licences.to_i
end

Then(/^the (\d+)(?:st|nd|rd|th) title should be "(.*?)"$/) do |position, title|
  page.all("#licensing-overview ul li")[position.to_i - 1].should have_link(title)
end

Then(/^the (\d+)(?:st|nd|rd|th) link should be "(.*?)"$/) do |position, href|
  page.all("#licensing-overview ul li a")[position.to_i - 1][:href].should == href
end

Then(/^the page title should be "(.*?)"$/) do |title|
  page.find("#content h1").should have_content(title)
end

Then(/^the (\d+)(?:st|nd|rd|th) subtitle should be "(.*?)"$/) do |position, subtitle|
  page.all("#content h2")[position.to_i - 1].should have_content(Regexp.new subtitle)
end

Then(/^the navigation link for "(.*?)" should be active$/) do |link_title|
  page.find("#global nav li.active a[text()='#{link_title}']").should be_visible
end

When /^there should be (\d+) authorities$/ do |num_authorities|
  page.all("ul#authorities li").count.should == num_authorities.to_i
end
