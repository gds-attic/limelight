When(/^the tax-disc realtime module should display a user count of 11$/) do
  @module = page.find('#tax-disc-realtime strong').should have_content('11')
end

When(/^the sorn realtime module should display a user count of 11$/) do
  @module = page.find('#sorn-realtime strong').should have_content('11')
end
