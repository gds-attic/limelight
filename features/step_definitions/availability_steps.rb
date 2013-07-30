Then(/^the uptime module should display (.*)$/) do |uptime|
  page.find('#uptime strong').should have_content(uptime)
  page.find('#uptime-graph').should have_xpath("./*[name()='svg']")
end

Then(/^the response time module should display (.*)$/) do |response_time|
  page.find('#response-time strong').should have_content(response_time)
  page.find('#response-time-graph').should have_xpath("./*[name()='svg']")
end
