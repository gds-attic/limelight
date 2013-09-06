namespace :jasmine do

  desc "Start Jasmine with Blanket JS support"
  task :blanketjs do
    ENV['RUN_JASMINE_WITH_CODE_COVERAGE'] = "true"
    Rake::Task['jasmine'].invoke
  end
end
