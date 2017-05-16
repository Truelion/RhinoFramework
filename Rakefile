
namespace :js do
  require 'fileutils'
  require 'net/http'
  require 'yaml'
  require 'find'
  require 'webrick'
  include WEBrick
  
  task :build, :appname do |t, args|
      puts Dir::pwd
      dir = args[:appname] ?  args[:appname] : Dir::pwd
      sh %{java -jar tools/js.jar tools/concat.js #{dir}}
  end

  task :server, :appname do |t, args|
      dir = args[:appname] ?  args[:appname] : Dir::pwd
      port = 3000 #12000 + (dir.hash % 1000)
      puts "URL: http://localhost:#{port}"
      s = HTTPServer.new(:Port => port, :DocumentRoot => dir)
      trap("INT"){ s.shutdown }
      s.start
  end
end

