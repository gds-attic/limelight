Then(/^the lpa completion rate should display "(.*?)"$/) do |rate|
  page.find("#lpa-completion-selected").should have_content(rate)
end
