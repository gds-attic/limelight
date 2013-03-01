module Jasmine
  def self.runner_template
    File.read(File.join(File.dirname(__FILE__), "run.html.erb"))
  end
end
