Then(/^the uptime module for the fco transaction should display (.*)$/) do |uptime|
  page.all('#uptime-module').count.should == 1
  page.find('#uptime strong').should have_content(uptime)
end
