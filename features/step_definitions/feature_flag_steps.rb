Given(/^the flag (.+) is (not )?set$/) do |flag, status|
  Settings::feature_toggles[flag.to_sym] = !(status == 'not ')
end
