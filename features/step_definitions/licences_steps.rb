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

When(/^I go to (.*)$/) do |url|
  visit url
end

Then(/^I should get back a status of (\d+)$/) do |status_code|
  page.status_code.should == status_code.to_i
end

Then(/^there should be (\d+) licences$/) do |num_licences|
  page.all("#licences-list li").count.should == num_licences.to_i
end

Then(/^the "(.*?)" count should be (\d+)$/) do |type, count|
  page.find("##{type}-list .count").should have_content(count)
end

Then(/^the (\d+)(?:st|nd|rd|th) group title should be "(.*?)"$/) do |position, title|
  page.all("#content dt")[position.to_i - 1].should have_content(title)
end

Then(/^the (\d+)(?:st|nd|rd|th) title in the (\d+)(?:st|nd|rd|th) group should be "(.*?)"$/) do |position, group, title|
  dd = page.all('#content dd')[group.to_i - 1]
  dd.all("li")[position.to_i - 1].should have_link(title)
end

Then(/^the (\d+)(?:st|nd|rd|th) link in the (\d+)(?:st|nd|rd|th) group should be "(.*?)"$/) do |position, group, href|
  dd = page.all('#content dd')[group.to_i - 1]
  dd.all("li a")[position.to_i - 1][:href].should == href
end

Then(/^the category title should be "(.*?)"$/) do |title|
  page.find("#content header p.category-title").should have_content(title)
end

Then(/^the category title should link to "(.*?)"$/) do |href|
  page.find("#content header p.category-title a")[:href].should == href
end

Then(/^the page title should be "(.*?)"$/) do |title|
  page.find("#content header h1").should have_content(title)
end

Then(/^the (\d+)(?:st|nd|rd|th) subtitle should be "(.*?)"$/) do |position, subtitle|
  page.all("#content section h1")[position.to_i - 1].should have_content(Regexp.new subtitle)
end

Then(/^the (\d+)(?:st|nd|rd|th) section description should be "(.*?)"$/) do |position, subtitle|
  section = page.all("#content section")[position.to_i - 1]
  section.find("h2").should have_content(Regexp.new subtitle)
end

Then(/^the navigation link for "(.*?)" should be active$/) do |link_title|
  page.find("#global nav li.sub-level a.current").should have_content(link_title)
end

When /^there should be (\d+) authorities$/ do |num_authorities|
  page.all("#authorities-list li").count.should == num_authorities.to_i
end

Then(/^I see a link to "(.*?)"$/) do |url|
  page.all("#content a[href=\"#{url}\"]").count.should == 1
end
