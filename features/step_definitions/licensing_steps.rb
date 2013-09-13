Then(/^there should be (\d+) licences$/) do |num_licences|
  page.all("#licences-list li").count.should == num_licences.to_i
end

Then(/^there should be (\d+) authorities$/) do |num_authorities|
  page.all("#authorities-list li").count.should == num_authorities.to_i
end

Given(/^Limelight is running$/) do
  #empty
end
