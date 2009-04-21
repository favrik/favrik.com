<?php
require_once 'config.inc.php';

Zend_Loader::loadClass('Zend_Gdata_YouTube');
Zend_Loader::loadClass('Zend_Gdata_AuthSub');
Zend_Loader::loadClass('Zend_Gdata_ClientLogin'); 

class yuplay {
    const AUTHENTICATION_URL = 'https://www.google.com/youtube/accounts/ClientLogin';

    const PLAYLISTS_URL = 'http://gdata.youtube.com/feeds/users/default/playlists';

    const APP_ID = 'YuPlay-0.1';

    private $options;

    private $YouTube;

    public function __construct($options) {
        $this->options = $options;
        $this->authenticate();
    }

    public function authenticate() {
        $this->YouTube = new Zend_Gdata_YouTube(
            $this->getAuthHTTPClient(), 
            self::APP_ID, 
            $this->options['client_id'], 
            $this->options['key']
        );
    }

    public function createPlaylist($playlist) {
        $pl = $this->YouTube->newPlaylistListEntry();
        $pl->description = $this->YouTube
                                ->newDescription()
                                ->setText($playlist['description']);
        $pl->title = $this->YouTube
                          ->newTitle()
                          ->setText($playlist['title']);
            $aha = $this->YouTube->insertEntry($pl, self::PLAYLISTS_URL);
            echo $aha;
    }

    private function getAuthHTTPClient() {
        return Zend_Gdata_ClientLogin::getHttpClient(
            $username = $this->options['username'],
            $password = $this->options['password'],
            $service = 'youtube',
            $client = null,
            $source = self::APP_ID,
            $loginToken = null,
            $loginCaptcha = null,
            self::AUTHENTICATION_URL
        );
    }
}

$options = array(
    'key'       => 'AI39si6eUylJ3tD5pIKc2c7VOH_KI8mX3-bImclfQB0p4Eqd0Sp7r29EH_8xR3vWcANKffrMm0xhYShI_5UmsKl2mN1z7GSS6Q',
    'client_id' => 'ytapi-FavioManriquezLe-player-3462i3ii-0',
    'username'  => 'Trekstor',
    'password'  => 'n0m4m3s'
);
$yp = new yuplay($options);
