namespace :test do
  desc "Run all tests"
  task :all => ["spec", "jasmine:phantom:ci", "cucumber"]
end

task :default => ["test:all"]
