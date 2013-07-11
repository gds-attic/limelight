Then(/^the uptime module should display (.*)$/) do |uptime|
  page.all('#uptime-module').count.should == 1
  page.find('#uptime strong').should have_content(uptime)
end

Then(/^the response time module should display (.*)$/) do |response_time|
  page.all('#response-time-module').count.should == 1
  page.find('#response-time strong').should have_content(response_time)
end
