Given(/^the flag (.+) is (not )?set$/) do |flag, status|
  Rails.application.config.feature_toggles[flag.to_sym] = !(status == 'not ')
end

Given(/^The ([\w-]+) ([\w-]+) bucket returns the response in "(.*?)"$/) do |service, bucket, fixture_file|
  BackdropStubController.register(service, bucket, fixture_file)
end

Then(/^I should see the module "(.*?)"$/) do |module_title|
  @module = page.find(:xpath, "//section[contains(h1, '#{module_title}')]")

  @module.should be_visible
end

Then /^the module should contain a link to "(.*?)"$/ do |url|
  @module.should have_link(nil, href: url)
end

Then /^the module should contain the text "(.*?)"$/ do |text|
  @module.should have_content(text)
end

Then /^the module should contain a graph$/ do
  @module.should have_xpath("./figure/*[name()='svg']")
end

Then /^the module should contain a table$/ do
  @module.should have_css("table")
end

Then /^the module should contain (\d+) tabs?$/ do |tab_count|
  @module.should have_xpath("./nav//li[#{tab_count}]")
end


When(/^I go to (.*)$/) do |url|
  visit url
end

When(/^I click on "(.*?)"$/) do |name|
  find(:xpath, "//a[contains(text(),'#{name}')]").click
end

Then(/^I should be at (.*)$/) do |path|
  URI.parse(current_url).path.should == path
end

Then(/^I should get back a status of (\d+)$/) do |status_code|
  page.status_code.should == status_code.to_i
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
  page.all("#content header h1")[0].should have_content(title)
end

Then(/^the page subtitle should be "(.*?)"$/) do |title|
  page.all("#content header h2")[0].should have_content(title)
end

Then(/^the (\d+)(?:st|nd|rd|th) subtitle should be "(.*?)"$/) do |position, subtitle|
  page.all("#content section h1")[position.to_i - 1].should have_content(Regexp.new subtitle)
end

Then(/^the (\d+)(?:st|nd|rd|th) section description should be "(.*?)"$/) do |position, subtitle|
  section = page.all("#content section")[position.to_i - 1]
  section.find("h2").should have_content(Regexp.new subtitle)
end

Then(/^the navigation link for "(.*?)" should be active$/) do |link_title|
  page.find("nav.performance-nav li a.active").should have_content(link_title)
end

Then(/^I see a link to "(.*?)"$/) do |url|
  page.all("#content a[href=\"#{url}\"]").count.should >= 1
end

Then(/^show me the page$/) do
  puts page.html
end
