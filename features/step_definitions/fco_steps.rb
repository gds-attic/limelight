Then(/^the completion rate should display "(.*?)"$/) do |rate|
  page.find("#volumetrics-completion-selected").should have_content(rate)
end

Then(/^the applications completed should display "(.*?)"$/) do |completed|
  page.find("#volumetrics-submissions-selected").should have_content(completed)
end