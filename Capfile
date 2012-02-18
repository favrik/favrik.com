# This should be edited and renamed to Capfile before being able
# to use Capistrano

load 'deploy' if respond_to?(:namespace) # cap2 differentiator

ssh_options[:forward_agent] = true
default_run_options[:pty] = true

set :application, "favrik.com"
set :repository,  "git@github.com:favrik/favrik.com.git"

set :scm, :git
set :deploy_via, :remote_cache

set :user, "favio"
set :scm_username, "favrik"

set :use_sudo, false

set :jekyll, "/var/lib/gems/1.8/bin/jekyll --lsi --pygments --rdiscount --permalink /:year/:month/:day/:title"

namespace :deploy do
  task :restart, :roles => :app, :except => { :no_release => true } do
    # Do nothing!
  end

  task :website_setup do
    run <<-CMD
      cd #{current_release}/blog &&
      #{jekyll} #{current_release}/blog #{current_release}/blog/_site &&
      cp #{current_release}/blog/_site/recent_posts.html #{current_release}/website/_includes &&
      cd #{current_release}/website &&
      #{jekyll} #{current_release}/website #{current_release}/website/_site
    CMD

    site_simlynks
  end

  task :site_symlinks do
    # Jobs and Imgsite symlink
    run <<-CMD
      mkdir -p #{current_release}/website/_site/projects &&
      ln -s /home/web/favrik.com/jobs #{current_release}/website/_site/projects/jobs &&
      ln -s /home/web/favrik.com/imgsite #{current_release}/website/_site/imgsite
    CMD
  end

  before "deploy:symlink", "deploy:website_setup"
  after "deploy", "deploy:cleanup"
end


# Deployment tasks

task :prod do
  role :web, "74.207.249.87"
  set :branch, "master"
  set :deploy_to, "/home/web/favrik.com/deploy"
end






