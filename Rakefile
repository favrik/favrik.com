def jekyll(opts = "--lsi --rdiscount --pygments --permalink /:year/:month/:day/:title", path = "/var/lib/gems/1.8/bin/")
  sh "rm -rf _site"
  sh path + "jekyll " + opts
end

namespace :site do
  
  desc "Build site using Jekyll"
  task :build do
    jekyll
  end

  desc "Serve on Localhost with port 4000"
  task :default do
    jekyll("--server --auto")
  end
  
  desc "remove deploy.rb, Capfile, Readme and deploy.rb from _site"
  task :purge do
    sh "rm _site/Capfile README.md _site/Rakefile"
    sh "rm -rf _site/config"
  end
  
  desc "build and purge _site"
  task :generate => [:build]
  
  desc "clean _site"
  task :clean do
    sh "rm -rf _site"
  end
end



