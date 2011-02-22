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

namespace :deploy do
    task :restart, :roles => :app, :except => { :no_release => true } do
        # Do nothing!
    end

    task :website_setup do
        run "cd #{current_release}"
        #run "jekyll"
    end

    task :site_symlinks do
     
    end

    
    after "deploy:symlink", "deploy:website_setup"
    after "deploy", "deploy:cleanup"
end



task :prod do
    role :web, "74.207.249.87"
    set :branch, "master"
    set :deploy_to, "/home/web/favrik.com/deploy"
    
    after "deploy:symlink", "deploy:site_symlinks"
end






