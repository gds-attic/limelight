namespace :dev do
  
  namespace :rails do
    desc "Check if Rails development server is running"
    task :status do
      if `lsof -i :49221 | tail -1` =~ /^ruby/
        puts "Rails server running" 
      else
        puts "Rails server not running"
      end
    end
    
    desc "Start Rails development server"
    task :start do
      if !(`lsof -i :49221 | tail -1` =~ /^ruby/)
        sh %[STATIC_DEV='https://static.production.alphagov.co.uk' USE_STUB_API=true BACKDROP_PORT=49221 rails s -p 49221 -d]
      end
      Rake::Task['dev:rails:status'].invoke
    end
    
    desc "Stop Rails development server"
    task :stop do
      port_probe = `lsof -i :49221 | tail -1`.split
      
      if port_probe.first =~ /^ruby/
        sh %[kill -9 #{port_probe[1]}]
      end
      Rake::Task['dev:rails:status'].invoke
    end
    
    desc "Restart Rails development server"
    task restart: ['dev:rails:stop', 'dev:rails:start'] do
      Rake::Task['dev:rails:status'].invoke
    end
  end
  
end
